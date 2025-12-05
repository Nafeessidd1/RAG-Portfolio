'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Code, Brain, Database } from 'lucide-react'

export default function Projects() {
  const projects = [
    {
      title: 'RAG-Powered Portfolio Chatbot',
      description: 'A production-ready RAG system with document ingestion, vector embeddings, and an interactive chat interface. Features source citations, recruiter mode, and agentic capabilities.',
      tech: ['Next.js', 'LangChain', 'FAISS', 'OpenAI', 'TypeScript'],
      category: 'AI/ML',
      icon: Brain,
      gradient: 'from-purple-600 to-purple-800',
    },
    {
      title: 'Agentic AI Workflow Engine',
      description: 'Built autonomous AI agents with planning, tool use, and multi-step reasoning. Integrated with external APIs and databases for real-world task automation.',
      tech: ['LangGraph', 'Python', 'FastAPI', 'PostgreSQL'],
      category: 'AI/ML',
      icon: Code,
      gradient: 'from-blue-600 to-purple-600',
    },
    {
      title: 'Vector Database Management System',
      description: 'Scalable system for managing embeddings, semantic search, and knowledge bases. Supports multiple vector DB backends with unified API.',
      tech: ['Pinecone', 'Supabase', 'FAISS', 'Node.js'],
      category: 'Backend',
      icon: Database,
      gradient: 'from-green-600 to-blue-600',
    },
  ]

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Showcase of my work in AI, web development, and intelligent systems
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="glass-effect rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <project.icon className="w-8 h-8 text-white" />
              </div>

              {/* Category */}
              <span className="text-sm text-purple-400 mb-2 block">{project.category}</span>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3 text-purple-300">{project.title}</h3>

              {/* Description */}
              <p className="text-purple-200/80 mb-4">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm">Code</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="text-sm">Demo</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-purple-200/80 mb-4">Want to see more?</p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </div>
  )
}

