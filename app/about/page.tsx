'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Target, Code, Database, Cloud, Sparkles } from 'lucide-react'

export default function About() {
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
            About Me
          </h1>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Passionate AI Engineer building the next generation of intelligent systems
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-effect rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-purple-300">Background</h2>
            <div className="prose prose-invert max-w-none text-purple-200/90 space-y-4">
              <p>
                I'm an AI Engineer with a deep passion for building intelligent systems that solve real-world problems. 
                My expertise spans agentic AI, retrieval-augmented generation (RAG), and full-stack web development.
              </p>
              <p>
                I specialize in creating autonomous AI agents that can reason, plan, and interact with tools and APIs. 
                My work involves designing RAG systems that combine the power of large language models with vector databases 
                to provide accurate, context-aware responses.
              </p>
              <p>
                With a strong foundation in modern web technologies, I build production-ready applications that seamlessly 
                integrate AI capabilities into user-friendly interfaces.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Agentic AI Skills Highlight - Unique Section for Recruiters */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gradient-border">
            <div className="gradient-border-content">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-purple-300">Agentic AI Expertise</h2>
              </div>
              <p className="text-purple-200/90 mb-6 text-lg">
                <strong className="text-purple-300">For Recruiters:</strong> I specialize in building autonomous AI systems 
                that go beyond simple chatbots. My agentic AI implementations include:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="glass-effect rounded-lg p-6">
                  <Brain className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold mb-2 text-purple-300">Planning & Reasoning</h3>
                  <p className="text-purple-200/80">
                    Building AI agents with advanced planning capabilities using frameworks like LangGraph, 
                    enabling complex multi-step problem solving and decision-making.
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-6">
                  <Zap className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold mb-2 text-purple-300">Tool Use & Integration</h3>
                  <p className="text-purple-200/80">
                    Creating agents that can interact with APIs, databases, file systems, and external services, 
                    enabling real-world automation and task execution.
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-6">
                  <Target className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold mb-2 text-purple-300">RAG Architecture</h3>
                  <p className="text-purple-200/80">
                    Designing retrieval-augmented generation systems with vector databases (Pinecone, Supabase, FAISS), 
                    semantic search, and context-aware response generation.
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-6">
                  <Database className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold mb-2 text-purple-300">Vector Databases</h3>
                  <p className="text-purple-200/80">
                    Expertise in embedding generation, similarity search, and managing knowledge bases for 
                    production RAG applications with citation and source tracking.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <h3 className="text-xl font-bold mb-3 text-purple-300">Production Experience</h3>
                <ul className="space-y-2 text-purple-200/90">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Built end-to-end RAG systems with document ingestion pipelines (PDF, MD, DOCX)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Implemented agentic workflows with LangChain/LangGraph for complex task automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Designed chatbot UIs with source citations and recruiter-mode summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Deployed scalable AI applications on Vercel, AWS, and cloud platforms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technical Skills */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-purple-300">Technical Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Code, label: 'TypeScript/JavaScript', category: 'Languages' },
              { icon: Brain, label: 'LangChain/LangGraph', category: 'AI Frameworks' },
              { icon: Database, label: 'Vector DBs', category: 'Data' },
              { icon: Cloud, label: 'Next.js/React', category: 'Frontend' },
            ].map((skill, index) => (
              <motion.div
                key={skill.label}
                className="glass-effect rounded-lg p-6 text-center hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <skill.icon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-300 mb-1">{skill.label}</h3>
                <p className="text-sm text-purple-200/60">{skill.category}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

