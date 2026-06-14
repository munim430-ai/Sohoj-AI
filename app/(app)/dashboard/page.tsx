'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '@/styles/uber-design.css'

interface Stats {
  totalConversations: number
  creditsUsed: number
  documentsCount: number
}

interface Organization {
  id: string
  name: string
  credit_balance: number
  subscription_tier: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    creditsUsed: 0,
    documentsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
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

        const { count: conversationCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', userData.organization_id)

        const { count: documentCount } = await supabase
          .from('faq_documents')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', userData.organization_id)

        setStats({
          totalConversations: conversationCount || 0,
          creditsUsed: 0,
          documentsCount: documentCount || 0,
        })
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <main className="app-main">
        <p style={{ color: '#757575' }}>Loading…</p>
      </main>
    )
  }

  return (
    <main className="app-main">
      {organization && (
        <>
          <div className="app-page-head">
            <h1 className="app-page-title">Welcome back, {organization.name}</h1>
            <p className="app-page-sub">Here&apos;s your customer support overview.</p>
          </div>

          <div
            className="app-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 24 }}
          >
            <div className="app-card" style={{ borderTop: '3px solid #1a73e8' }}>
              <p className="app-stat-label">Conversations</p>
              <p className="app-stat-value">{stats.totalConversations}</p>
              <p className="app-stat-hint">Total handled</p>
            </div>
            <div className="app-card" style={{ borderTop: '3px solid #34a853' }}>
              <p className="app-stat-label">Credits</p>
              <p className="app-stat-value">
                {organization.subscription_tier === 'enterprise'
                  ? 'Unlimited'
                  : organization.credit_balance.toLocaleString()}
              </p>
              <p className="app-stat-hint">Remaining this period</p>
            </div>
            <div className="app-card" style={{ borderTop: '3px solid #ea4335' }}>
              <p className="app-stat-label">Documents</p>
              <p className="app-stat-value">{stats.documentsCount}</p>
              <p className="app-stat-hint">Knowledge base files</p>
            </div>
            <div className="app-card" style={{ borderTop: '3px solid #fbbc04' }}>
              <p className="app-stat-label">Plan</p>
              <p className="app-stat-value" style={{ textTransform: 'capitalize', fontSize: 26 }}>
                {organization.subscription_tier}
              </p>
              <Link
                href="/billing"
                style={{ fontSize: 13, color: '#1a73e8', textDecoration: 'none', fontWeight: 600 }}
              >
                Manage plan →
              </Link>
            </div>
          </div>

          <div className="app-grid" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
            <div className="app-card">
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 14px' }}>Quick actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link href="/chat" className="app-action">
                  <p className="app-action-title">Start a chat</p>
                  <p className="app-action-sub">Test your AI agent in Bangla or English</p>
                </Link>
                <Link href="/settings?tab=documents" className="app-action">
                  <p className="app-action-title">Upload FAQ</p>
                  <p className="app-action-sub">Add documents to your knowledge base</p>
                </Link>
                <Link href="/billing" className="app-action">
                  <p className="app-action-title">Buy credits</p>
                  <p className="app-action-sub">Top up to keep conversations flowing</p>
                </Link>
              </div>
            </div>

            <div className="app-card">
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 14px' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><Link href="/faq" style={{ fontSize: 14, color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>Documentation &amp; FAQ</Link></li>
                <li><Link href="/settings" style={{ fontSize: 14, color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>Widget setup</Link></li>
                <li><Link href="/contact" style={{ fontSize: 14, color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>Contact support</Link></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
