// Quick test script to verify Mistral API key
import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const apiKey = process.env.MISTRAL_API_KEY

if (!apiKey) {
  console.error('❌ MISTRAL_API_KEY not found in .env.local')
  process.exit(1)
}

console.log('✅ MISTRAL_API_KEY found')
console.log(`Key starts with: ${apiKey.substring(0, 10)}...`)
console.log(`Key length: ${apiKey.length}`)

// Test if it's a valid format (Mistral keys usually start with specific prefixes)
if (apiKey.length < 20) {
  console.warn('⚠️  API key seems too short. Mistral keys are usually longer.')
}

console.log('\n💡 To test the API key, try running: npm run ingest')
console.log('   If it fails, check:')
console.log('   1. The key is correct at https://console.mistral.ai/api-keys/')
console.log('   2. The key has not expired')
console.log('   3. Your internet connection is working')

