// Load environment variables from .env.local
import dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import * as fs from 'fs'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { getVectorStore, addDocumentsToStore, saveVectorStore } from '../lib/vectorstore'

const DOCUMENTS_DIR = path.join(process.cwd(), 'data', 'documents')
const SUPPORTED_EXTENSIONS = ['.pdf', '.md', '.txt', '.docx']

async function readPDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdfParse(dataBuffer)
  return data.text
}

async function readDOCX(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath })
  return result.value
}

async function readMarkdown(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, 'utf-8')
}

async function processFile(filePath: string): Promise<Document[]> {
  const ext = path.extname(filePath).toLowerCase()
  const fileName = path.basename(filePath)

  let text: string

  try {
    switch (ext) {
      case '.pdf':
        text = await readPDF(filePath)
        break
      case '.docx':
        text = await readDOCX(filePath)
        break
      case '.md':
      case '.txt':
        text = await readMarkdown(filePath)
        break
      default:
        console.warn(`Unsupported file type: ${ext}`)
        return []
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const chunks = await splitter.createDocuments([text], [], {
      source: fileName,
      type: ext.slice(1),
    })

    console.log(`Processed ${fileName}: ${chunks.length} chunks`)
    return chunks
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error)
    return []
  }
}

async function ingestDocuments() {
  console.log('Starting document ingestion...')

  // Ensure documents directory exists
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    console.log(`Creating documents directory: ${DOCUMENTS_DIR}`)
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true })
    console.log('Please add your documents (PDF, MD, DOCX) to the data/documents folder')
    return
  }

  // Get all files
  const files = fs.readdirSync(DOCUMENTS_DIR)
  const supportedFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase()
    return SUPPORTED_EXTENSIONS.includes(ext)
  })

  if (supportedFiles.length === 0) {
    console.log('No supported documents found in data/documents')
    console.log('Supported formats: PDF, MD, TXT, DOCX')
    return
  }

  console.log(`Found ${supportedFiles.length} document(s) to process`)

  // Process all files
  const allDocuments: Document[] = []
  for (const file of supportedFiles) {
    const filePath = path.join(DOCUMENTS_DIR, file)
    const documents = await processFile(filePath)
    allDocuments.push(...documents)
  }

  if (allDocuments.length === 0) {
    console.log('No documents were successfully processed')
    return
  }

  // Add to vector store
  console.log(`Adding ${allDocuments.length} document chunks to vector store...`)
  await addDocumentsToStore(allDocuments)

  console.log('✅ Document ingestion complete!')
}

// Run ingestion
ingestDocuments().catch(console.error)

