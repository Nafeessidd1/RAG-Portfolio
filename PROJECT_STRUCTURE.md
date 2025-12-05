# Project Structure

This document explains the organization of the portfolio project.

```
port/
│
├── app/                          # Next.js App Router directory
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # RAG chatbot API endpoint
│   │
│   ├── about/
│   │   └── page.tsx             # About page with bio and agentic AI section
│   │
│   ├── blog/
│   │   └── page.tsx             # Blog listing page
│   │
│   ├── chat/
│   │   └── page.tsx             # Interactive chatbot UI
│   │
│   ├── contact/
│   │   └── page.tsx             # Contact form and information
│   │
│   ├── projects/
│   │   └── page.tsx             # Projects showcase
│   │
│   ├── resume/
│   │   └── page.tsx             # Resume viewer and download
│   │
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout with Navbar and Footer
│   └── page.tsx                 # Home page with hero section
│
├── components/                   # Reusable React components
│   ├── Navbar.tsx               # Navigation bar with mobile menu
│   └── Footer.tsx                # Footer with links and social media
│
├── lib/                          # Utility libraries and helpers
│   ├── agents.ts                 # Agentic AI features (planner, file reader, web search)
│   ├── retriever.ts              # Document retrieval from vector store
│   └── vectorstore.ts            # Vector database management (FAISS)
│
├── scripts/                      # Build and utility scripts
│   └── ingest.ts                 # Document ingestion script (PDF, MD, DOCX)
│
├── data/                         # Data directory
│   ├── documents/                # Source documents for RAG
│   │   ├── sample-bio.md         # Sample biography
│   │   └── sample-resume.md      # Sample resume
│   └── embeddings/               # Generated vector embeddings (created by ingest script)
│       ├── faiss.index           # FAISS index file
│       └── docstore.json         # Document store metadata
│
├── public/                       # Static assets
│   └── resume.pdf                # PDF resume (add your own)
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── DEPLOYMENT.md                 # Deployment guide
├── QUICKSTART.md                 # Quick start guide
├── README.md                     # Main documentation
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment configuration
```

## Key Files Explained

### API Routes
- **`app/api/chat/route.ts`**: Main chatbot API endpoint that handles:
  - RAG-based responses using vector store
  - Agentic features (planner, file reader, web search)
  - Recruiter mode for structured summaries
  - Source citations

### Pages
- **`app/page.tsx`**: Home page with animated hero section
- **`app/about/page.tsx`**: About page with special "Agentic AI Expertise" section for recruiters
- **`app/chat/page.tsx`**: Interactive chatbot UI with markdown rendering and source citations
- **`app/projects/page.tsx`**: Projects showcase with animations
- **`app/resume/page.tsx`**: Resume viewer with download functionality

### Libraries
- **`lib/vectorstore.ts`**: Manages FAISS vector database (can be swapped for Pinecone/Supabase)
- **`lib/retriever.ts`**: Handles document retrieval from vector store
- **`lib/agents.ts`**: Implements agentic AI features:
  - File reader tool
  - Web search tool
  - Planner tool

### Scripts
- **`scripts/ingest.ts`**: Processes documents (PDF, MD, DOCX) and creates embeddings

## Data Flow

1. **Document Ingestion**:
   - Documents in `data/documents/` → `scripts/ingest.ts` → Embeddings → `data/embeddings/`

2. **Chat Flow**:
   - User message → `app/api/chat/route.ts` → Vector search → LLM → Response with sources

3. **Agentic Features**:
   - User request → Agent executor → Tool selection → Tool execution → Response

## Customization Points

1. **Theme**: `tailwind.config.ts` and `app/globals.css`
2. **Content**: `data/documents/` and page components
3. **Vector DB**: `lib/vectorstore.ts` (switch to Pinecone/Supabase)
4. **Social Links**: `components/Footer.tsx` and `app/page.tsx`

## Environment Variables

Required:
- `OPENAI_API_KEY`: For embeddings and chat

Optional:
- `PINECONE_API_KEY`, `PINECONE_INDEX`: For Pinecone vector DB
- `SUPABASE_URL`, `SUPABASE_KEY`: For Supabase vector DB

