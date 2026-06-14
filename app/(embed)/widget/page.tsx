'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface OrgBranding {
  logo_url: string | null
  primary_color: string
  company_name: string | null
  show_powered_by: boolean
}

function EmbedWidgetContent() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [branding, setBranding] = useState<OrgBranding | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const organizationId = searchParams.get('org_id') || ''

  useEffect(() => {
    // Load organization branding
    const loadBranding = async () => {
      try {
        const response = await fetch(`/api/organization?org_id=${organizationId}`)
        if (response.ok) {
          const org = await response.json()
          setBranding(org.branding)

          // Set CSS variables for white-label styling
          document.documentElement.style.setProperty('--primary', org.branding.primary_color)
        }
      } catch (error) {
        console.error('Failed to load branding:', error)
      }
    }

    if (organizationId) {
      loadBranding()
    }
  }, [organizationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
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
          organizationId,
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ''

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
                }
              }
            }

            fullResponse = lines[lines.length - 1]
          }
        }

        if (aiResponse) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
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

  const primaryColor = branding?.primary_color || '#3b82f6'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: primaryColor,
          color: 'white',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {branding?.logo_url && (
            <img src={branding.logo_url} alt="Logo" style={{ height: '32px' }} />
          )}
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              {branding?.company_name || 'Customer Support'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
              {loading ? 'Typing...' : 'Ready to help'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>Hello! 👋</p>
            <p style={{ fontSize: '12px' }}>How can we help you today?</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: message.role === 'user' ? primaryColor : '#e5e7eb',
                color: message.role === 'user' ? 'white' : '#1f2937',
                fontSize: '14px',
                lineHeight: '1.4',
              }}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#e5e7eb',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: '0.1s',
                  }}
                />
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: '0.2s',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid #e5e7eb',
          padding: '12px',
          backgroundColor: 'white',
        }}
      >
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = primaryColor
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: loading || !input.trim() ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </form>

        {branding?.show_powered_by && (
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
            Powered by ShahojAI
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default function EmbedWidget() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading...</div>}>
      <EmbedWidgetContent />
    </Suspense>
  )
}
