// Direct test of Mistral API
import dotenv from 'dotenv'
import * as path from 'path'
import axios from 'axios'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const apiKey = process.env.MISTRAL_API_KEY

if (!apiKey) {
  console.error('❌ MISTRAL_API_KEY not found')
  process.exit(1)
}

console.log('🔍 Testing Mistral API directly...')
console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)

// Test the embeddings endpoint directly
const testEmbedding = async () => {
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/embeddings',
      {
        model: 'mistral-embed',
        input: ['test embedding']
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )
    
    console.log('✅ Mistral API test successful!')
    console.log(`Response status: ${response.status}`)
    console.log(`Embedding dimensions: ${response.data.data[0].embedding.length}`)
    return true
  } catch (error) {
    if (error.response) {
      console.error('❌ Mistral API Error:')
      console.error(`Status: ${error.response.status}`)
      console.error(`Message: ${error.response.data?.message || error.response.statusText}`)
      if (error.response.status === 401) {
        console.error('\n💡 This means your API key is invalid or expired')
        console.error('   Get a new key at: https://console.mistral.ai/api-keys/')
      }
    } else if (error.request) {
      console.error('❌ No response from Mistral API')
      console.error('   This could mean:')
      console.error('   - Network connectivity issue')
      console.error('   - Firewall blocking the request')
      console.error('   - Mistral API is down')
    } else {
      console.error('❌ Error:', error.message)
    }
    return false
  }
}

testEmbedding().then(success => {
  if (!success) {
    console.log('\n💡 Recommendation: Use OpenAI instead for now')
    console.log('   Add to .env.local: OPENAI_API_KEY=your_key')
    process.exit(1)
  }
})

