import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MistralAIEmbeddings } from '@langchain/mistralai'
import { Document } from '@langchain/core/documents'
import * as fs from 'fs'
import * as path from 'path'

const EMBEDDINGS_DIR = path.join(process.cwd(), 'data', 'embeddings')
const EMBEDDINGS_PATH = path.join(EMBEDDINGS_DIR, 'faiss.index')

let vectorStore: FaissStore | null = null
let embeddingsInstance: any = null

export async function getVectorStore(): Promise<FaissStore> {
  if (vectorStore && embeddingsInstance) {
    return vectorStore
  }

  // Use Mistral AI if API key is provided, otherwise fall back to OpenAI
  const useMistral = !!process.env.MISTRAL_API_KEY
  
  if (useMistral) {
    console.log('Using Mistral AI for embeddings')
    try {
      // Validate API key format
      if (!process.env.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY.trim() === '') {
        throw new Error('MISTRAL_API_KEY is empty or invalid')
      }
      
      embeddingsInstance = new MistralAIEmbeddings({
        apiKey: process.env.MISTRAL_API_KEY,
        modelName: 'mistral-embed', // Default model
      })
      
      // Check if embeddings exist - try to load them
      if (fs.existsSync(EMBEDDINGS_PATH)) {
        try {
          console.log('Loading existing vector store from:', EMBEDDINGS_DIR)
          vectorStore = await FaissStore.load(EMBEDDINGS_DIR, embeddingsInstance)
          console.log('✅ Loaded existing vector store successfully')
          return vectorStore
        } catch (error: any) {
          console.error('⚠️  Error loading vector store:', error.message)
          // If loading fails, try to continue with empty store
        }
      }
      
      // Test embeddings with a small sample first
      try {
        console.log('Testing Mistral embeddings with sample text...')
        await embeddingsInstance.embedQuery('test')
        console.log('✅ Mistral embeddings test successful')
      } catch (testError: any) {
        console.error('❌ Mistral embeddings test failed:', testError.message)
        // Don't throw - allow fallback to OpenAI if available
        if (!process.env.OPENAI_API_KEY) {
          throw testError
        }
      }
      
      // Only create empty store if we don't have existing embeddings
      // This should only happen on first run
      if (!fs.existsSync(EMBEDDINGS_PATH)) {
        console.log('Creating new empty vector store (first time setup)')
        vectorStore = await FaissStore.fromDocuments([], embeddings)
        console.log('Created new vector store')
      } else {
        // If we got here, loading failed but file exists - try one more time with error details
        throw new Error(
          `Failed to load vector store from ${EMBEDDINGS_DIR}. ` +
          `The embeddings file exists but couldn't be loaded. ` +
          `Try running 'npm run ingest' again to regenerate.`
        )
      }
      return vectorStore
    } catch (error: any) {
      console.error('❌ Mistral AI embeddings failed:', error.message)
      console.error('This might be due to:')
      console.error('1. Invalid or expired API key')
      console.error('2. Network connectivity issues')
      console.error('3. Mistral API service issues')
      console.error('\n💡 Falling back to OpenAI (if OPENAI_API_KEY is set)')
      
      // Fall back to OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        console.log('Using OpenAI for embeddings (fallback)')
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: 'text-embedding-3-small',
        })
        
        if (fs.existsSync(EMBEDDINGS_PATH)) {
          try {
            vectorStore = await FaissStore.load(EMBEDDINGS_DIR, embeddings)
            console.log('Loaded existing vector store')
            return vectorStore
          } catch (error) {
            console.error('Error loading vector store:', error)
          }
        }
        
        vectorStore = await FaissStore.fromDocuments([], embeddings)
        console.log('Created new vector store')
        return vectorStore
      } else {
        throw new Error(
          `Mistral AI embeddings failed and no OpenAI fallback available.\n` +
          `Error: ${error.message}\n\n` +
          `Please check:\n` +
          `1. Your MISTRAL_API_KEY is valid: https://console.mistral.ai/api-keys/\n` +
          `2. The API key has proper permissions\n` +
          `3. Your internet connection is working\n` +
          `Or set OPENAI_API_KEY as a fallback`
        )
      }
    }
  } else {
    // Fall back to OpenAI
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'No API key found! Please set either MISTRAL_API_KEY or OPENAI_API_KEY in .env.local\n' +
        'Get Mistral API key (free): https://console.mistral.ai/api-keys/\n' +
        'Get OpenAI API key: https://platform.openai.com/api-keys'
      )
    }
    
    console.log('Using OpenAI for embeddings')
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    })
    
    // Check if embeddings exist - try to load them
    if (fs.existsSync(EMBEDDINGS_PATH)) {
      try {
        console.log('Loading existing vector store from:', EMBEDDINGS_DIR)
        vectorStore = await FaissStore.load(EMBEDDINGS_DIR, embeddings)
        console.log('✅ Loaded existing vector store successfully')
        return vectorStore
      } catch (error: any) {
        console.error('⚠️  Error loading vector store:', error.message)
        console.log('Will create a new one...')
        // Don't return here, continue to create new store
      }
    }
    
    // Only create empty store if we don't have existing embeddings
    if (!fs.existsSync(EMBEDDINGS_PATH)) {
      console.log('Creating new empty vector store (first time setup)')
      vectorStore = await FaissStore.fromDocuments([], embeddings)
      console.log('Created new vector store')
    } else {
      // If we got here, loading failed but file exists
      throw new Error(
        `Failed to load vector store from ${EMBEDDINGS_DIR}. ` +
        `The embeddings file exists but couldn't be loaded. ` +
        `Try running 'npm run ingest' again to regenerate.`
      )
    }
    return vectorStore
  }

}

export async function saveVectorStore(store: FaissStore): Promise<void> {
  // Ensure directory exists
  if (!fs.existsSync(EMBEDDINGS_DIR)) {
    fs.mkdirSync(EMBEDDINGS_DIR, { recursive: true })
  }

  await store.save(EMBEDDINGS_DIR)
  console.log('Vector store saved')
}

export async function addDocumentsToStore(documents: Document[]): Promise<void> {
  try {
    const store = await getVectorStore()
    
    // Add documents with error handling
    console.log(`Generating embeddings for ${documents.length} document chunks...`)
    await store.addDocuments(documents)
    
    // Save the updated store
    await saveVectorStore(store)
    
    // Update the cached store
    vectorStore = store
  } catch (error: any) {
    console.error('❌ Error adding documents to vector store:', error.message)
    if (error.message.includes('status') || error.message.includes('undefined')) {
      console.error('\n💡 This error usually means:')
      console.error('   1. Invalid Mistral API key')
      console.error('   2. Network connectivity issues')
      console.error('   3. Mistral API service problems')
      console.error('\n🔧 Solutions:')
      console.error('   - Verify your API key at: https://console.mistral.ai/api-keys/')
      console.error('   - Try using OpenAI instead (set OPENAI_API_KEY in .env.local)')
      console.error('   - Check your internet connection')
    }
    throw error
  }
}

