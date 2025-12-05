import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MistralAIEmbeddings } from '@langchain/mistralai'
import { Document } from '@langchain/core/documents'
import * as fs from 'fs'
import * as path from 'path'

const EMBEDDINGS_DIR = path.join(process.cwd(), 'data', 'embeddings')
const EMBEDDINGS_PATH = path.join(EMBEDDINGS_DIR, 'faiss.index')

let vectorStore: FaissStore | null = null
let embeddingsInstance: OpenAIEmbeddings | MistralAIEmbeddings | null = null

export async function getVectorStore(): Promise<FaissStore> {
  if (vectorStore && embeddingsInstance) {
    return vectorStore
  }

  const useMistral = !!process.env.MISTRAL_API_KEY

  // ---------- MISTRAL BRANCH ----------
  if (useMistral) {
    console.log('Using Mistral AI for embeddings')
    try {
      if (!process.env.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY.trim() === '') {
        throw new Error('MISTRAL_API_KEY is empty or invalid')
      }

      embeddingsInstance = new MistralAIEmbeddings({
        apiKey: process.env.MISTRAL_API_KEY,
        modelName: 'mistral-embed',
      })

      // Try loading existing store first
      if (fs.existsSync(EMBEDDINGS_PATH)) {
        try {
          console.log('Loading existing vector store from:', EMBEDDINGS_DIR)
          vectorStore = await FaissStore.load(EMBEDDINGS_DIR, embeddingsInstance)
          console.log('✅ Loaded existing vector store successfully')
          return vectorStore
        } catch (error: any) {
          console.error('⚠️  Error loading vector store:', error.message)
        }
      }

      // Test that embeddings actually work
      try {
        console.log('Testing Mistral embeddings with sample text...')
        await embeddingsInstance.embedQuery('test')
        console.log('✅ Mistral embeddings test successful')
      } catch (testError: any) {
        console.error('❌ Mistral embeddings test failed:', testError.message)
        if (!process.env.OPENAI_API_KEY) {
          throw testError
        }
      }

      // Create empty store only if no existing index
      if (!fs.existsSync(EMBEDDINGS_PATH)) {
        console.log('Creating new empty vector store (first time setup)')
        vectorStore = await FaissStore.fromDocuments([], embeddingsInstance)
        console.log('Created new vector store')
      } else {
        // File exists but load failed
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
      // fall through to OpenAI fallback below
    }
  }

  // ---------- OPENAI BRANCH / FALLBACK ----------
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
  embeddingsInstance = embeddings

  if (fs.existsSync(EMBEDDINGS_PATH)) {
    try {
      console.log('Loading existing vector store from:', EMBEDDINGS_DIR)
      vectorStore = await FaissStore.load(EMBEDDINGS_DIR, embeddings)
      console.log('✅ Loaded existing vector store successfully')
      return vectorStore
    } catch (error: any) {
      console.error('⚠️  Error loading vector store:', error.message)
      console.log('Will create a new one...')
    }
  }

  if (!fs.existsSync(EMBEDDINGS_PATH)) {
    console.log('Creating new empty vector store (first time setup)')
    vectorStore = await FaissStore.fromDocuments([], embeddings)
    console.log('Created new vector store')
  } else {
    throw new Error(
      `Failed to load vector store from ${EMBEDDINGS_DIR}. ` +
        `The embeddings file exists but couldn't be loaded. ` +
        `Try running 'npm run ingest' again to regenerate.`
    )
  }

  return vectorStore
}

export async function saveVectorStore(store: FaissStore): Promise<void> {
  if (!fs.existsSync(EMBEDDINGS_DIR)) {
    fs.mkdirSync(EMBEDDINGS_DIR, { recursive: true })
  }

  await store.save(EMBEDDINGS_DIR)
  console.log('Vector store saved')
}

export async function addDocumentsToStore(documents: Document[]): Promise<void> {
  try {
    const store = await getVectorStore()

    console.log(`Generating embeddings for ${documents.length} document chunks...`)
    await store.addDocuments(documents)

    await saveVectorStore(store)
    vectorStore = store
  } catch (error: any) {
    console.error('❌ Error adding documents to vector store:', error.message)
    if (error.message?.includes('status') || error.message?.includes('undefined')) {
      console.error('\n💡 This error usually means:')
      console.error('   1. Invalid Mistral/OpenAI API key')
      console.error('   2. Network connectivity issues')
      console.error('   3. Embedding API service problems')
    }
    throw error
  }
}
