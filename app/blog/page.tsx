'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Blog() {
  const posts = [
    {
      title: 'Building Production RAG Systems: A Complete Guide',
      excerpt: 'Learn how to build scalable RAG systems with vector databases, embeddings, and proper citation handling.',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'AI/ML',
    },
    {
      title: 'Agentic AI: From Theory to Practice',
      excerpt: 'Exploring autonomous AI agents, planning frameworks, and real-world implementation strategies.',
      date: '2024-01-10',
      readTime: '12 min read',
      category: 'AI/ML',
    },
    {
      title: 'Vector Databases Comparison: Pinecone vs Supabase vs FAISS',
      excerpt: 'A comprehensive comparison of vector database solutions for RAG applications.',
      date: '2024-01-05',
      readTime: '6 min read',
      category: 'Tech',
    },
  ]

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-purple-200/80">
            Thoughts on AI, web development, and technology
          </p>
        </motion.div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              className="glass-effect rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <div className="flex items-center gap-4 mb-4 text-sm text-purple-300/60">
                <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">
                  {post.category}
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-3 text-purple-300 group-hover:text-purple-200 transition-colors">
                {post.title}
              </h2>

              <p className="text-purple-200/80 mb-6">{post.excerpt}</p>

              <Link
                href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group/link"
              >
                Read more
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Empty State Message */}
        <motion.div
          className="text-center mt-16 text-purple-200/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>More articles coming soon...</p>
        </motion.div>
      </div>
    </div>
  )
}

