'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Code, Brain, Zap, Github, Linkedin, Mail, Download } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-dark-bg to-purple-900 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent neon-purple"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              Nafees Siddiqui
            </motion.h1>
            
            <motion.p
              className="text-2xl md:text-4xl mb-4 text-purple-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Machine Learning Engineer 
            </motion.p>
            
            <motion.p
              className="text-lg md:text-xl mb-8 text-purple-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Building intelligent systems with agentic AI, RAG architectures, and modern web technologies
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass-effect hover:bg-purple-600/30 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-6 h-6 text-purple-400" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass-effect hover:bg-purple-600/30 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-6 h-6 text-purple-400" />
              </a>
              <a
                href="mailto:nafees@example.com"
                className="p-3 rounded-full glass-effect hover:bg-purple-600/30 transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-6 h-6 text-purple-400" />
              </a>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {/* ✅ Goes to /resume page, NOT directly to PDF */}
              <Link
                href="/resume"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                <Download className="w-5 h-5" />
                View Resume
              </Link>

              <Link
                href="/chat"
                className="px-8 py-4 glass-effect rounded-lg font-semibold hover:bg-purple-600/30 transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50"
              >
                Chat with AI
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Core Expertise
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'Agentic AI', desc: 'Building autonomous AI agents with planning, reasoning, and tool use capabilities' },
              { icon: Code, title: 'RAG Systems', desc: 'Designing retrieval-augmented generation systems with vector databases and embeddings' },
              { icon: Zap, title: 'Full-Stack', desc: 'Modern web development with Next.js, React, TypeScript, and cloud infrastructure' },
            ].map((skill, index) => (
              <motion.div
                key={skill.title}
                className="glass-effect rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <skill.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-purple-300">{skill.title}</h3>
                <p className="text-purple-200/80">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
