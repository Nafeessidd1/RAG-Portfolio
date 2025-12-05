# Quick Start Guide

Get your portfolio up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- **Mistral AI API key (FREE - Recommended)** - [Get one here](https://console.mistral.ai/api-keys/)
- OR OpenAI API key (paid) - [Get one here](https://platform.openai.com/api-keys)

## Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
   ```bash
   # Copy the example env file
   cp .env.example .env.local

   # Edit .env.local and add your Mistral AI API key (FREE)
   # MISTRAL_API_KEY=your-mistral-key-here
   
   # OR use OpenAI (paid)
   # OPENAI_API_KEY=sk-your-key-here
   ```

### 3. Add Your Documents (Optional)
Place your documents in `data/documents/`:
- PDF files (`.pdf`)
- Markdown files (`.md`)
- Word documents (`.docx`)
- Text files (`.txt`)

Sample documents are already included!

### 4. Ingest Documents
```bash
npm run ingest
```

This will:
- Process all documents in `data/documents/`
- Create embeddings using OpenAI
- Store them in a FAISS vector database

### 5. Start Development Server
```bash
npm run dev
```

### 6. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## What's Next?

1. **Customize Content**
   - Update `data/documents/sample-bio.md` with your bio
   - Update `data/documents/sample-resume.md` with your resume
   - Add your own projects to `app/projects/page.tsx`

2. **Add Your Resume PDF**
   - Place `resume.pdf` in the `public/` folder
   - It will be available for download

3. **Customize Theme**
   - Edit `tailwind.config.ts` to change colors
   - Modify `app/globals.css` for custom styles

4. **Update Social Links**
   - Edit `components/Footer.tsx`
   - Edit `app/page.tsx` (hero section)

5. **Deploy**
   - See `DEPLOYMENT.md` for Vercel deployment instructions

## Testing the Chatbot

1. Go to `/chat`
2. Try asking:
   - "What are Nafees's skills?"
   - "Tell me about his projects"
   - "What is his experience with RAG?"
3. Enable "Recruiter Mode" for structured summaries

## Troubleshooting

**Chatbot not working?**
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Verify documents were ingested: `npm run ingest`
- Check browser console for errors

**Build errors?**
- Run `npm run lint` to check for issues
- Ensure Node.js version is 18+
- Delete `node_modules` and `.next`, then `npm install`

**Documents not loading?**
- Check that files are in `data/documents/`
- Verify file formats are supported (PDF, MD, DOCX, TXT)
- Check ingestion script output for errors

## Need Help?

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for deployment help
- Check the code comments for implementation details

Happy coding! 🚀

