# Deployment Guide

## Vercel Deployment

### Step 1: Prepare Your Repository
1. Push your code to GitHub, GitLab, or Bitbucket
2. Ensure all environment variables are documented in `.env.example`

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Step 3: Environment Variables
Add the following environment variables in Vercel dashboard:
- `OPENAI_API_KEY` - Your OpenAI API key (required)

Optional:
- `PINECONE_API_KEY` - If using Pinecone
- `PINECONE_INDEX` - If using Pinecone
- `SUPABASE_URL` - If using Supabase
- `SUPABASE_KEY` - If using Supabase

### Step 4: Build Settings
- **Node Version:** 18.x or higher
- **Build Command:** `npm run build`
- **Install Command:** `npm install`

### Step 5: Post-Deployment
After deployment:
1. Run document ingestion (if needed):
   - You can add a build script or run manually via Vercel CLI
   - Or use Vercel's serverless functions to trigger ingestion

2. Verify:
   - Visit your deployed site
   - Test the chatbot at `/chat`
   - Verify all pages load correctly

## Environment Variables Setup

### Local Development
1. Copy `.env.example` to `.env.local`
2. Add your API keys:
   ```
   OPENAI_API_KEY=sk-...
   ```

### Production (Vercel)
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments

## Document Ingestion

### Option 1: Pre-build Ingestion
Add documents to `data/documents/` before deployment. The ingestion will run during build if you add it to the build script.

### Option 2: Post-deployment Ingestion
1. Use Vercel CLI:
   ```bash
   vercel env pull .env.local
   npm run ingest
   ```

2. Or create an API endpoint to trigger ingestion (recommended for production)

## Troubleshooting

### Build Failures
- Check Node.js version (18+ required)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run lint`

### Chatbot Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check that documents are ingested (vector store exists)
- Review API route logs in Vercel dashboard

### Vector Store Issues
- FAISS files are stored in `data/embeddings/`
- For production, consider using Pinecone or Supabase instead
- Ensure write permissions for vector store directory

## Performance Optimization

1. **Enable Edge Runtime** (optional):
   - Add `export const runtime = 'edge'` to API routes if compatible

2. **Optimize Images**:
   - Use Next.js Image component
   - Optimize any uploaded assets

3. **Caching**:
   - Static pages are automatically cached
   - API routes can use caching headers

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check function logs for API route errors
- Monitor OpenAI API usage and costs

