# Nafees Siddiqui - Portfolio Website

A modern, dark-purple themed portfolio website built with Next.js, React, Tailwind CSS, and Framer Motion. Features a production-ready RAG-based chatbot trained on bio, resume, projects, and documentation.

## 🚀 Features

### Portfolio Website
- **Modern Dark Purple Theme** - Beautiful gradients, neon accents, and smooth animations
- **Responsive Design** - Works seamlessly on all devices
- **SEO Optimized** - Meta tags, structured data, and optimized performance
- **Pages:**
  - Home - Hero section with animated background
  - About - Bio and agentic AI skills highlight for recruiters
  - Projects - Showcase of work with animations
  - Blog - Blog post listings
  - Chat - Interactive RAG-powered chatbot
  - Contact - Contact form and information
  - Resume - Resume viewer and download

### RAG Chatbot
- **Document Ingestion** - Supports PDF, Markdown, DOCX, and TXT files
- **Vector Database** - FAISS for local development (easily switchable to Pinecone/Supabase)
- **Source Citations** - Chatbot cites sources from knowledge base
- **Recruiter Mode** - Structured summaries for recruiters
- **Agentic Features:**
  - **Planner** - Creates step-by-step plans for complex tasks
  - **File Reader** - Reads files from documents directory
  - **Web Search** - Optional web search for current information

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- **Mistral AI API key (FREE - Recommended)** or OpenAI API key (for embeddings and chat)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd port
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Mistral AI API key (free):
   ```
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```
   
   Or use OpenAI (paid):
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Get Mistral API key (free):** https://console.mistral.ai/api-keys/

4. **Add your documents**
   - Place your PDF, Markdown, or DOCX files in `data/documents/`
   - Sample documents are included: `sample-bio.md` and `sample-resume.md`

5. **Ingest documents into vector database**
   ```bash
   npm run ingest
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
port/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── chat/         # RAG chatbot API
│   ├── about/             # About page
│   ├── blog/              # Blog page
│   ├── chat/              # Chat UI page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   ├── resume/            # Resume page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Navigation bar
│   └── Footer.tsx         # Footer component
├── lib/                   # Utility libraries
│   ├── vectorstore.ts     # Vector database management
│   ├── retriever.ts       # Document retrieval
│   └── agents.ts          # Agentic AI features
├── scripts/               # Scripts
│   └── ingest.ts          # Document ingestion script
├── data/                  # Data directory
│   └── documents/         # Source documents (PDF, MD, DOCX)
│       ├── sample-bio.md
│       └── sample-resume.md
└── public/                # Static assets
```

## 🔧 Configuration

### Vector Database

The project uses FAISS by default for local development. To switch to other providers:

**Pinecone:**
```typescript
// lib/vectorstore.ts
import { PineconeStore } from '@langchain/pinecone'
// Update getVectorStore() to use PineconeStore
```

**Supabase:**
```typescript
// lib/vectorstore.ts
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
// Update getVectorStore() to use SupabaseVectorStore
```

### Environment Variables

Create `.env.local` with:
```
# Mistral AI (Free - Recommended)
MISTRAL_API_KEY=your_mistral_key_here

# OR OpenAI (Paid - Fallback)
OPENAI_API_KEY=your_openai_key_here

# Optional: Vector DB
PINECONE_API_KEY=optional
PINECONE_INDEX=optional
SUPABASE_URL=optional
SUPABASE_KEY=optional
```

**Note:** The system will use Mistral AI if `MISTRAL_API_KEY` is provided, otherwise it falls back to OpenAI.

## 📝 Usage

### Document Ingestion

1. Add documents to `data/documents/`
2. Run ingestion:
   ```bash
   npm run ingest
   ```
3. Documents are chunked, embedded, and stored in the vector database

### Chatbot

- Navigate to `/chat`
- Ask questions about Nafees's background, projects, or skills
- Enable "Recruiter Mode" for structured summaries
- The chatbot uses RAG to retrieve relevant information and cites sources

### Agentic Features

The chatbot automatically uses agentic features when:
- User asks to "plan" something
- User requests to "read file" or "read [filename]"
- User asks to "search" or mentions "web search"

You can also explicitly enable agent mode in the chat API.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Build

```bash
npm run build
npm start
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the purple theme:
```typescript
colors: {
  purple: {
    // Your custom purple shades
  }
}
```

### Content

- Update `data/documents/` with your own documents
- Modify pages in `app/` directory
- Update social links in `components/Footer.tsx` and `app/page.tsx`

## 📚 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI/ML:**
  - LangChain
  - OpenAI (GPT-4, Embeddings)
  - FAISS (Vector DB)
- **Document Processing:**
  - pdf-parse (PDF)
  - mammoth (DOCX)
- **UI Components:** Lucide React (Icons)

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project as a template for your own portfolio.

## 🙏 Acknowledgments

- Built with Next.js and LangChain
- Icons from Lucide React
- Animations powered by Framer Motion

---

**Note:** 
- **Recommended:** Use Mistral AI (free) - Get your API key at https://console.mistral.ai/api-keys/
- **Alternative:** Use OpenAI (paid) - Get your API key at https://platform.openai.com/api-keys
- The system automatically uses Mistral if `MISTRAL_API_KEY` is set, otherwise falls back to OpenAI

