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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <p style={{ color: '#757575' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid #e0e0e0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#000000' }}>ShahojAI</h1>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/dashboard" style={{ fontSize: '16px', fontWeight: '500', color: '#000000', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link href="/chat" style={{ fontSize: '16px', fontWeight: '400', color: '#757575', textDecoration: 'none' }}>
              Chat
            </Link>
            <Link href="/settings" style={{ fontSize: '16px', fontWeight: '400', color: '#757575', textDecoration: 'none' }}>
              Settings
            </Link>
          </div>
        </div>
        <Link href="/settings" style={{ fontSize: '16px', color: '#757575', textDecoration: 'none' }}>
          Profile
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
        {organization && (
          <>
            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#000000', marginBottom: '8px' }}>
                Welcome back, {organization.name}
              </h2>
              <p style={{ fontSize: '16px', color: '#757575' }}>Here's your customer support overview</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
              {/* Stat Card 1 */}
              <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', borderLeft: '3px solid #1a73e8' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#757575', textTransform: 'uppercase' }}>Conversations</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#000000', margin: '16px 0 0 0' }}>
                  {stats.totalConversations}
                </p>
                <p style={{ fontSize: '12px', color: '#bdbdbd', marginTop: '8px' }}>Total conversations</p>
              </div>

              {/* Stat Card 2 */}
              <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', borderLeft: '3px solid #34a853' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#757575', textTransform: 'uppercase' }}>Credits</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#000000', margin: '16px 0 0 0' }}>
                  {organization.credit_balance}
                </p>
                <p style={{ fontSize: '12px', color: '#bdbdbd', marginTop: '8px' }}>Credits remaining</p>
              </div>

              {/* Stat Card 3 */}
              <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', borderLeft: '3px solid #ea4335' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#757575', textTransform: 'uppercase' }}>Documents</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#000000', margin: '16px 0 0 0' }}>
                  {stats.documentsCount}
                </p>
                <p style={{ fontSize: '12px', color: '#bdbdbd', marginTop: '8px' }}>Knowledge base files</p>
              </div>

              {/* Stat Card 4 */}
              <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', borderLeft: '3px solid #fbbc04' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#757575', textTransform: 'uppercase' }}>Plan</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#000000', margin: '16px 0 0 0', textTransform: 'capitalize' }}>
                  {organization.subscription_tier}
                </p>
                <Link href="/billing" style={{ fontSize: '12px', color: '#1a73e8', textDecoration: 'none', fontWeight: '500', marginTop: '8px', display: 'inline-block' }}>
                  Upgrade →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000000', marginBottom: '16px' }}>Quick actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link
                    href="/chat"
                    style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 150ms',
                    }}
                  >
                    <p style={{ fontWeight: '600', color: '#000000', margin: '0 0 4px 0' }}>Start a chat</p>
                    <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Test your AI agent</p>
                  </Link>
                  <Link
                    href="/settings?tab=documents"
                    style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 150ms',
                    }}
                  >
                    <p style={{ fontWeight: '600', color: '#000000', margin: '0 0 4px 0' }}>Upload FAQ</p>
                    <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Add knowledge base files</p>
                  </Link>
                  <Link
                    href="/billing"
                    style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 150ms',
                    }}
                  >
                    <p style={{ fontWeight: '600', color: '#000000', margin: '0 0 4px 0' }}>Buy credits</p>
                    <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>Purchase more credits</p>
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000000', marginBottom: '16px' }}>Resources</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>
                    <a href="#" style={{ fontSize: '14px', color: '#1a73e8', textDecoration: 'none', fontWeight: '500' }}>
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ fontSize: '14px', color: '#1a73e8', textDecoration: 'none', fontWeight: '500' }}>
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ fontSize: '14px', color: '#1a73e8', textDecoration: 'none', fontWeight: '500' }}>
                      Widget Setup
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ fontSize: '14px', color: '#1a73e8', textDecoration: 'none', fontWeight: '500' }}>
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
