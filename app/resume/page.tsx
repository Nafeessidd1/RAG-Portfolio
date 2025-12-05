'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'

export default function Resume() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FileText className="w-10 h-10 text-purple-400" />
              Resume
            </h1>
            <p className="text-purple-200/80">View and download my resume</p>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-3">
            {/* Download PDF */}
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>

            {/* Download MD */}
            <a
              href="/resume.md"
              download
              className="px-6 py-3 glass-effect rounded-lg font-semibold hover:bg-purple-600/30 transition-all duration-300 border border-purple-500/30 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download MD
            </a>
          </div>
        </motion.div>

        {/* Embedded PDF */}
        <motion.div
          className="glass-effect rounded-2xl p-4 md:p-6 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <iframe
            src="/resume.pdf"
            className="w-full h-[800px] rounded-xl border border-purple-500/20"
          />
        </motion.div>

      </div>
    </div>
  )
}
