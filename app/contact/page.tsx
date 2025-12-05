'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Send, Github, Linkedin, MessageSquare, Phone } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      alert("Thank you for your message! I'll get back to you soon.")
      setFormData({ name: '', email: '', message: '' })
    }, 1000)
  }

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
            Get In Touch
          </h1>
          <p className="text-xl text-purple-200/80">
            Let's collaborate on your next AI project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-purple-200">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark-card border border-purple-500/30 
                    text-purple-100 focus:outline-none focus:border-purple-500 
                    focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-purple-200">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark-card border border-purple-500/30 
                    text-purple-100 focus:outline-none focus:border-purple-500 
                    focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="nafeessidd35@gmail.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-purple-200">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-dark-card border border-purple-500/30 
                    text-purple-100 focus:outline-none focus:border-purple-500 
                    focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 
                  rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 
                  transition-all duration-300 flex items-center justify-center gap-2 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Contact Information</h2>
              <div className="space-y-6">

                {/* Email */}
                <a
                  href="mailto:nafeessidd35@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-lg bg-dark-card hover:bg-purple-900/20 
                  transition-all group"
                >
                  <div className="p-3 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-300/60">Email</p>
                    <p className="text-purple-200">nafeessidd35@gmail.com</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:8690057819"
                  className="flex items-center gap-4 p-4 rounded-lg bg-dark-card hover:bg-purple-900/20 
                  transition-all group"
                >
                  <div className="p-3 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-300/60">Phone</p>
                    <p className="text-purple-200">8690057819</p>
                  </div>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Nafeessidd1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-dark-card hover:bg-purple-900/20 
                  transition-all group"
                >
                  <div className="p-3 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                    <Github className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-300/60">GitHub</p>
                    <p className="text-purple-200">github.com/Nafeessidd1</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/nafees-siddiqui-729535229/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-dark-card hover:bg-purple-900/20 
                  transition-all group"
                >
                  <div className="p-3 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                    <Linkedin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-300/60">LinkedIn</p>
                    <p className="text-purple-200">linkedin.com/in/nafees-siddiqui-729535229/</p>
                  </div>
                </a>

                {/* AI Chat */}
                <Link
                  href="/chat"
                  className="flex items-center gap-4 p-4 rounded-lg bg-dark-card hover:bg-purple-900/20 
                  transition-all group"
                >
                  <div className="p-3 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-300/60">AI Chat</p>
                    <p className="text-purple-200">Chat with my AI assistant</p>
                  </div>
                </Link>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
