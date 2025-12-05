import { VectorStoreRetriever } from '@langchain/core/vectorstores'
import { FaissStore } from '@langchain/community/vectorstores/faiss'

export function getRetriever(vectorStore: FaissStore): VectorStoreRetriever {
  return vectorStore.asRetriever({
    k: 5, // Number of documents to retrieve
    searchType: 'similarity',
  })
}

