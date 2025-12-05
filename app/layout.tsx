import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nafees Siddiqui | Portfolio & AI Engineer',
  description: 'Portfolio of Nafees Siddiqui - AI Engineer specializing in agentic AI, RAG systems, and modern web development',
  keywords: ['Nafees Siddiqui', 'AI Engineer', 'Portfolio', 'RAG', 'Agentic AI', 'Next.js'],
  authors: [{ name: 'Nafees Siddiqui' }],
  openGraph: {
    title: 'Nafees Siddiqui | Portfolio & AI Engineer',
    description: 'Portfolio of Nafees Siddiqui - AI Engineer specializing in agentic AI, RAG systems, and modern web development',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

