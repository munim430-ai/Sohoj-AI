'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import '@/styles/uber-design.css'

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
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      {/* Messages Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px', maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '48px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#000000', marginBottom: '8px' }}>
                Start a conversation
              </h2>
              <p style={{ fontSize: '16px', color: '#757575' }}>Ask anything about your products or services</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  ...(message.role === 'user'
                    ? {
                        background: '#000000',
                        color: '#ffffff',
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        background: '#f5f5f5',
                        color: '#000000',
                        borderBottomLeftRadius: '4px',
                        borderBottomRightRadius: '12px',
                      }),
                }}
              >
                <p style={{ fontSize: '16px', lineHeight: '1.5', margin: '0 0 4px 0' }}>{message.content}</p>
                <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#bdbdbd',
                    animation: 'loading-pulse 1.4s infinite',
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#bdbdbd',
                    animation: 'loading-pulse 1.4s infinite',
                    animationDelay: '0.2s',
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#bdbdbd',
                    animation: 'loading-pulse 1.4s infinite',
                    animationDelay: '0.4s',
                  }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{ borderTop: '1px solid #e0e0e0', background: '#ffffff', padding: '24px 32px' }}>
        <form onSubmit={handleSendMessage} style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a question..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'inherit',
              transition: 'all 150ms',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 24px',
              background: loading || !input.trim() ? '#bdbdbd' : '#000000',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              borderRadius: '12px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 150ms',
            }}
          >
            Send
          </button>
        </form>
      </div>

      <style>{`
        @keyframes loading-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
