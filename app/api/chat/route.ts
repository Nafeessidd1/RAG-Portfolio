// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { ChatMistralAI } from '@langchain/mistralai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { getVectorStore } from '@/lib/vectorstore'
import { getRetriever } from '@/lib/retriever'
import { createAgentExecutor } from '@/lib/agents'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

/**
 * Helper: return a safe string from a model/chain result
 * Handles different shapes that LangChain may return.
 */
function extractTextFromResult(res: any): string {
  try {
    if (!res) return ''
    // If it's a LangChain ChatResult-like object
    if (typeof res === 'string') return res
    // If result has .content directly
    if (res.content && typeof res.content === 'string') return res.content
    // If result has .text
    if (res.text && typeof res.text === 'string') return res.text
    // If result has generations / output arrays
    if (Array.isArray(res.output) && res.output.length > 0) {
      // try common patterns
      const first = res.output[0]
      if (typeof first === 'string') return first
      if (first.content) return first.content
      if (first.text) return first.text
      if (first[0] && (first[0].content || first[0].text)) {
        return first[0].content || first[0].text
      }
    }
    // fallback: try JSON-stringify small content
    return JSON.stringify(res).slice(0, 10000)
  } catch (e) {
    return ''
  }
}

// Use Mistral AI if API key is provided, otherwise fall back to OpenAI
const useMistral = !!process.env.MISTRAL_API_KEY
const model: BaseChatModel = useMistral
  ? new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      modelName: 'mistral-large-latest',
      temperature: 0.7,
    })
  : new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

const SYSTEM_PROMPT = `You are an AI assistant representing Nafees Siddiqui, an ML Engineer specialized in agentic AI, RAG systems, deep learning and classical machine learning.

Your role is to answer questions about Nafees's background, projects, skills, and experience based on the provided context.

Guidelines:
- Be professional and helpful
- Cite specific sources when available
- If asked in recruiter mode, provide concise, structured summaries
- Focus on technical skills, achievements, and relevant experience
- If information is not in the context, say so rather than making assumptions

Context from knowledge base:
{context}`

const RECRUITER_PROMPT = `You are an AI assistant helping recruiters evaluate Nafees Siddiqui.

Provide concise, structured summaries in this format:
- **Key Skills**: [List main technical skills]
- **Experience**: [Relevant experience highlights]
- **Projects**: [Notable projects]
- **Fit**: [Why this candidate fits the role]

Base your response on the provided context:
{context}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { message, recruiterMode, history, useAgent } = body as {
      message?: string
      recruiterMode?: boolean
      history?: Array<{ role: string; content: string }>
      useAgent?: boolean
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Determine whether to use the agent
    const shouldUseAgent =
      !!useAgent ||
      message.toLowerCase().includes('plan') ||
      message.toLowerCase().includes('read file') ||
      message.toLowerCase().includes('search') ||
      message.toLowerCase().includes('web')

    // If agent requested, try agent first (agent has its own toolset)
    if (shouldUseAgent) {
      try {
        const agent = await createAgentExecutor()

        // convert history to agent-friendly shape
        const chatHistory = (history || []).map((msg) => {
          if (msg.role === 'user') return { role: 'human' as const, content: msg.content }
          return { role: 'ai' as const, content: msg.content }
        })

        const result = await agent.invoke({
          input: message,
          chat_history: chatHistory,
        })

        const text = extractTextFromResult(result)
        return NextResponse.json({
          response: text || 'Agent executed but returned no text.',
          sources: ['Agentic Tools'],
        })
      } catch (agentError: any) {
        console.error('Agent error:', agentError)
        // fall through to RAG
      }
    }

    // Standard RAG-based response
    try {
      // 1) Load vector store & retriever
      const vectorStore = await getVectorStore()
      const retriever = getRetriever(vectorStore)
      const relevantDocs = await retriever.getRelevantDocuments(message)

      const context = (relevantDocs || [])
        .map((doc: any) => {
          const source = doc?.metadata?.source || doc?.metadata?.sourceName || 'Unknown'
          return `Source: ${source}\n${doc.pageContent || doc.content || ''}`
        })
        .join('\n\n---\n\n')

      const sources = Array.from(new Set((relevantDocs || []).map((d: any) => d?.metadata?.source || 'Unknown')))

      // Choose prompt
      const promptTemplate = recruiterMode ? RECRUITER_PROMPT : SYSTEM_PROMPT

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', promptTemplate],
        new MessagesPlaceholder('chat_history'),
        ['human', '{input}'],
      ])

      // Build chat history objects (LangChain messages)
      const chatHistory = (history || []).map((msg) => {
        if (msg.role === 'user') return new HumanMessage(msg.content)
        return new AIMessage(msg.content)
      })

      // Build a runnable chain: feed context in the input so templates can use {context}
      const chain = RunnableSequence.from([
        {
          input: (input: { input: string; chat_history: any[] }) => input.input,
          chat_history: (input: { input: string; chat_history: any[] }) => input.chat_history,
          // attach context via a function so prompt template can pick it up if it uses {context}
          context: () => context,
        },
        prompt,
        model,
      ])

      const rawResponse = await chain.invoke({
        input: message,
        chat_history: chatHistory,
      })

      // extract text safely
      const text = extractTextFromResult(rawResponse)
      const finalText = text || 'I could not generate a response. Try again or reduce message complexity.'

      return NextResponse.json({
        response: finalText,
        sources: sources.slice(0, 5),
      })
    } catch (vectorError: any) {
      // Log the error and attempt a fallback generation without context
      console.error('Vector search error:', vectorError)
      console.log('Attempting response without vector context...')

      // Build a system prompt that explicitly says there's no context
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', SYSTEM_PROMPT.replace('{context}', 'No context available from knowledge base.')],
        new MessagesPlaceholder('chat_history'),
        ['human', '{input}'],
      ])

      const chatHistory = (history || []).map((msg) => {
        if (msg.role === 'user') return new HumanMessage(msg.content)
        return new AIMessage(msg.content)
      })

      // If Mistral failing and OPENAI_API_KEY is set, create a fallback OpenAI model
      let fallbackModel = model
      if (process.env.OPENAI_API_KEY && useMistral) {
        console.log('Using OpenAI as fallback for chat model')
        fallbackModel = new ChatOpenAI({
          modelName: 'gpt-4-turbo-preview',
          temperature: 0.7,
          openAIApiKey: process.env.OPENAI_API_KEY,
        })
      }

      const fallbackChain = RunnableSequence.from([
        {
          input: (input: { input: string }) => input.input,
          chat_history: () => chatHistory,
        },
        prompt,
        fallbackModel,
      ])

      const raw = await fallbackChain.invoke({ input: message })
      const text = extractTextFromResult(raw)

      return NextResponse.json({
        response: (text || 'Unable to generate an answer at this time.') + '\n\n(Note: Unable to retrieve context from knowledge base)',
        sources: [],
      })
    }
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: error?.message || 'An error occurred' }, { status: 500 })
  }
}
