'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data: userData } = await supabase
          .from('users')
          .select('organization_id')
          .eq('auth_id', user.id)
          .single()

        if (!userData) {
          router.push('/onboard')
          return
        }

        const { data: orgData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', userData.organization_id)
          .single()

        setOrganization(orgData)

        // Load conversation history
        const { data: conversations } = await supabase
          .from('conversations')
          .select('*')
          .eq('organization_id', userData.organization_id)
          .order('created_at', { ascending: true })
          .limit(20)

        if (conversations) {
          const msgs: Message[] = conversations.flatMap((conv) => [
            {
              id: conv.id + '-user',
              role: 'user' as const,
              content: conv.user_message,
              timestamp: new Date(conv.created_at),
            },
            ...(conv.ai_response
              ? [
                  {
                    id: conv.id,
                    role: 'assistant' as const,
                    content: conv.ai_response,
                    timestamp: new Date(conv.created_at),
                  },
                ]
              : []),
          ])
          setMessages(msgs)
        }
      } catch (error) {
        console.error('Error loading chat:', error)
      }
    }

    loadOrganization()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !organization) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          organizationId: organization.id,
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ''
      let assistantMessageId = ''

      if (reader) {
        let done = false
        let fullResponse = ''

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone

          if (value) {
            const text = decoder.decode(value)
            fullResponse += text

            // Parse streaming response
            const lines = fullResponse.split('\n')
            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i]
              if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6))
                if (data.content) {
                  aiResponse += data.content
                  assistantMessageId = data.id
                }
              }
            }

            fullResponse = lines[lines.length - 1]
          }
        }

        if (aiResponse) {
          const assistantMessage: Message = {
            id: assistantMessageId || Date.now().toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ShahojAI Chat</h1>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl w-full mx-auto">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start a conversation</h2>
              <p className="text-gray-600 dark:text-gray-400">Ask questions about your products or services</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="text-sm md:text-base">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-8">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
