'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 border-t border-purple-500/20">
      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-300">Nafees Siddiqui</h3>
            <p className="text-purple-200/80">
              Machine Learning Engineer specializing in Agentic AI, RAG systems, Deep Learning, and Classical ML.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-purple-200/80 hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="/projects" className="text-purple-200/80 hover:text-purple-400 transition-colors">Projects</a></li>
              <li><a href="/blog" className="text-purple-200/80 hover:text-purple-400 transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-purple-200/80 hover:text-purple-400 transition-colors">Contact</a></li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-300">Connect</h3>
            <div className="flex gap-4">

              {/* GitHub */}
              <a
                href="https://github.com/Nafeessidd1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-effect hover:bg-purple-600/30 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5 text-purple-400" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/nafees-siddiqui-729535229/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-effect hover:bg-purple-600/30 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5 text-purple-400" />
              </a>

              {/* Email */}
              <a
                href="mailto:nafeessidd35@gmail.com"
                className="p-2 rounded-full glass-effect hover:bg-purple-600/30 transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-5 h-5 text-purple-400" />
              </a>

            </div>
          </motion.div>
        </div>

        {/* Clean Footer Bottom Line */}
        <motion.div
          className="text-center pt-8 border-t border-purple-500/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-purple-200/60">
            © {currentYear} Nafees Siddiqui • All Rights Reserved
          </p>
        </motion.div>

      </div>
    </footer>
  )
}

