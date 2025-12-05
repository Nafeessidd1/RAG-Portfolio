import { ChatOpenAI } from '@langchain/openai'
import { ChatMistralAI } from '@langchain/mistralai'
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { z } from 'zod'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

// Initialize the LLM - Use Mistral AI if API key is provided, otherwise fall back to OpenAI
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

// File Reader Tool
const fileReaderTool = new DynamicStructuredTool({
  name: 'read_file',
  description: 'Reads the contents of a file from the documents directory. Use this to access specific documents or files.',
  schema: z.object({
    filename: z.string().describe('The name of the file to read (e.g., sample-bio.md, sample-resume.md)'),
  }),
  func: async ({ filename }) => {
    try {
      const filePath = path.join(process.cwd(), 'data', 'documents', filename)
      if (!fs.existsSync(filePath)) {
        return `File ${filename} not found in documents directory.`
      }
      const content = fs.readFileSync(filePath, 'utf-8')
      return `Content of ${filename}:\n\n${content}`
    } catch (error: any) {
      return `Error reading file: ${error.message}`
    }
  },
})

// Web Search Tool (using DuckDuckGo or similar)
const webSearchTool = new DynamicStructuredTool({
  name: 'web_search',
  description: 'Searches the web for current information. Use this when you need up-to-date information not in the knowledge base.',
  schema: z.object({
    query: z.string().describe('The search query to look up on the web'),
  }),
  func: async ({ query }) => {
    try {
      // Using DuckDuckGo Instant Answer API (free, no API key needed)
      const response = await axios.get('https://api.duckduckgo.com/', {
        params: {
          q: query,
          format: 'json',
          no_html: '1',
          skip_disambig: '1',
        },
        timeout: 5000,
      })

      if (response.data.AbstractText) {
        return `Search results for "${query}":\n${response.data.AbstractText}\nSource: ${response.data.AbstractURL || 'DuckDuckGo'}`
      }

      // Fallback: return a message that web search is available but no results found
      return `Web search for "${query}" did not return specific results. The information may not be available or the search needs to be refined.`
    } catch (error: any) {
      // If web search fails, return a helpful message
      return `Web search is currently unavailable. Please rely on the knowledge base for information.`
    }
  },
})

// Planner Tool (for complex multi-step tasks)
const plannerTool = new DynamicStructuredTool({
  name: 'create_plan',
  description: 'Creates a step-by-step plan for complex tasks. Use this when the user asks for something that requires multiple steps.',
  schema: z.object({
    task: z.string().describe('The task that needs to be planned'),
    steps: z.array(z.string()).describe('Array of step descriptions for the plan'),
  }),
  func: async ({ task, steps }) => {
    const plan = steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
    return `Plan for "${task}":\n\n${plan}\n\nI can help execute these steps. Would you like me to proceed?`
  },
})

// Get all available tools
export function getAgentTools() {
  return [fileReaderTool, webSearchTool, plannerTool]
}

// Create agent executor
export async function createAgentExecutor() {
  const tools = getAgentTools()

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `You are an AI assistant representing Nafees Siddiqui. You have access to tools that can:
- Read files from the documents directory
- Search the web for current information
- Create plans for complex tasks

Use these tools when appropriate to provide comprehensive answers. Always cite your sources.`],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ])

  // Note: Function calling agents work best with OpenAI
  // Mistral AI support may be limited, so agent features will fall back to RAG if needed
  try {
    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools,
      prompt,
    })

    return new AgentExecutor({
      agent,
      tools,
      verbose: process.env.NODE_ENV === 'development',
    })
  } catch (error) {
    console.warn('Agent creation failed, function calling may not be supported with this model:', error)
    throw error
  }
}

