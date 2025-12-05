'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, FileText, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Nafees's AI assistant. I can answer questions about his background, projects, skills, and experience. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recruiterMode, setRecruiterMode] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // refs + helpers for controlled container scrolling
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const prevLenRef = useRef(messages.length)
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)
  const SCROLL_THRESHOLD = 120 // px tolerance to consider "near bottom"

  const scrollContainerToBottom = (smooth = true) => {
    const container = messagesContainerRef.current
    if (!container) return
    const top = container.scrollHeight - container.clientHeight
    if (smooth) container.scrollTo({ top, behavior: 'smooth' })
    else container.scrollTop = top
  }

  // detect if user scrolled up inside the chat container
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const onScroll = () => {
      const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight)
      setIsUserScrolledUp(distanceFromBottom > SCROLL_THRESHOLD)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initial check
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  // only auto-scroll when new messages append AND user isn't scrolled up
  useEffect(() => {
    if (messages.length > prevLenRef.current && !isUserScrolledUp) {
      // small timeout helps when DOM nodes are rendered/mounted
      setTimeout(() => scrollContainerToBottom(true), 50)
    }
    prevLenRef.current = messages.length
  }, [messages, isUserScrolledUp])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          recruiterMode,
          history: messages.slice(-5).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error.',
        sources: data.sources || [],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      // if user was near bottom, ensure assistant reply is shown
      setTimeout(() => {
        if (!isUserScrolledUp) scrollContainerToBottom(true)
      }, 80)
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-8 flex items-start justify-center">
      <div className="container mx-auto max-w-3xl">
        {/* Header (kept exactly as you required) */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-purple-200/80 mb-4">Ask me anything about Nafees's background, projects, and expertise</p>

          {/* Recruiter Mode Toggle */}
          <div className="flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={recruiterMode} onChange={(e) => setRecruiterMode(e.target.checked)} className="w-4 h-4 rounded border-purple-500 text-purple-600 focus:ring-purple-500" />
              <span className="text-sm text-purple-300">Recruiter Mode (Summary Format)</span>
            </label>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="glass-effect rounded-2xl p-6 h-[600px] max-w-2xl mx-auto flex flex-col shadow-2xl border border-purple-500/20">
          {/* Messages - Scrollable area (attach the container ref here) */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto mb-4 pr-2 min-h-0" style={{ scrollBehavior: 'smooth' }}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div key={`${message.timestamp.getTime()}-${index}`} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }} transition={{ duration: 0.3 }} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    {message.role === 'assistant' && <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div>}

                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${message.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' : 'bg-dark-card text-purple-100 border border-purple-500/30 hover:border-purple-500/50 transition-colors'}`}>
                      {message.role === 'assistant' ? (
                        <div>
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                          </div>

                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-purple-500/30">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                <span className="text-sm font-semibold text-purple-300">Sources:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {message.sources.map((source, idx) => (
                                  <span key={idx} className="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-300 border border-purple-500/30">{source}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          <button onClick={() => copyToClipboard(message.content, index)} className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                            {copiedIndex === index ? (<><Check className="w-3 h-3" />Copied</>) : (<><Copy className="w-3 h-3" />Copy</>)}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><p>{message.content}</p></div>
                      )}
                    </div>

                    {message.role === 'user' && <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-purple-400" /></div>}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div>
                  <div className="bg-dark-card rounded-2xl p-4 border border-purple-500/30 flex items-center gap-2"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /><span className="text-purple-300 text-sm">Thinking...</span></div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input - Fixed at bottom */}
          <div className="flex gap-3 pt-4 border-t border-purple-500/20">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="Ask about Nafees's experience, projects, or skills..." className="flex-1 px-4 py-3 rounded-lg bg-dark-card border border-purple-500/30 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" disabled={isLoading} />
            <button type="button" onClick={handleSend} disabled={isLoading || !input.trim()} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-purple-500/50">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Suggested Questions */}
        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-sm text-purple-300/60 mb-3">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {["What are Nafees's agentic AI skills?", 'Tell me about his RAG projects', 'What technologies does he use?'].map((question) => (
              <button key={question} onClick={() => { setInput(question); setTimeout(() => handleSend(), 100) }} className="px-4 py-2 text-sm rounded-lg glass-effect hover:bg-purple-600/30 transition-all text-purple-300 hover:text-purple-200" disabled={isLoading}>
                {question}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
