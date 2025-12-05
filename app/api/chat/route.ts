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

const SYSTEM_PROMPT = `You are an AI assistant representing Nafees Siddiqui, an AI Engineer specializing in agentic AI, RAG systems, and full-stack development.

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
    const { message, recruiterMode, history, useAgent } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Use agentic features if requested or if the message suggests complex tasks
    const shouldUseAgent = useAgent || 
      message.toLowerCase().includes('plan') ||
      message.toLowerCase().includes('read file') ||
      message.toLowerCase().includes('search') ||
      message.toLowerCase().includes('web')

    if (shouldUseAgent) {
      try {
        const agent = await createAgentExecutor()
        
        // Build conversation history for agent
        const chatHistory = (history || []).map((msg: { role: string; content: string }) => {
          if (msg.role === 'user') {
            return { role: 'human' as const, content: msg.content }
          }
          return { role: 'ai' as const, content: msg.content }
        })

        const result = await agent.invoke({
          input: message,
          chat_history: chatHistory,
        })

        return NextResponse.json({
          response: result.output,
          sources: ['Agentic Tools'],
        })
      } catch (agentError: any) {
        console.error('Agent error:', agentError)
        // Fall through to RAG-based response
      }
    }

    // Standard RAG-based response
    try {
      const vectorStore = await getVectorStore()
      const retriever = getRetriever(vectorStore)
      const relevantDocs = await retriever.getRelevantDocuments(message)

      const context = relevantDocs
        .map((doc) => `Source: ${doc.metadata.source || 'Unknown'}\n${doc.pageContent}`)
        .join('\n\n---\n\n')

      const sources = Array.from(
        new Set(relevantDocs.map((doc) => doc.metadata.source || 'Unknown'))
      )

      // Choose prompt based on mode
      const promptTemplate = recruiterMode ? RECRUITER_PROMPT : SYSTEM_PROMPT

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', promptTemplate],
        new MessagesPlaceholder('chat_history'),
        ['human', '{input}'],
      ])

      // Build conversation history - convert to BaseMessage objects
      const chatHistory = (history || []).map((msg: { role: string; content: string }) => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content)
        }
        return new AIMessage(msg.content)
      })

      const chain = RunnableSequence.from([
        {
          input: (input: { input: string; chat_history: any[] }) => input.input,
          chat_history: (input: { input: string; chat_history: any[] }) => input.chat_history,
          context: () => context,
        },
        prompt,
        model,
      ])

      const response = await chain.invoke({
        input: message,
        chat_history: chatHistory,
      })

      return NextResponse.json({
        response: response.content as string,
        sources: sources.slice(0, 5), // Limit to 5 sources
      })
    } catch (vectorError: any) {
      console.error('Vector search error:', vectorError)
      // If vector search fails, still try to generate a response without context
      console.log('Attempting response without vector context...')
      
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', SYSTEM_PROMPT.replace('{context}', 'No context available from knowledge base.')],
        new MessagesPlaceholder('chat_history'),
        ['human', '{input}'],
      ])

      const chatHistory = (history || []).map((msg: { role: string; content: string }) => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content)
        }
        return new AIMessage(msg.content)
      })

      // Use OpenAI as fallback if Mistral is failing
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

      const response = await fallbackChain.invoke({
        input: message,
      })

      return NextResponse.json({
        response: response.content as string + '\n\n(Note: Unable to retrieve context from knowledge base)',
        sources: [],
      })
    }
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}

