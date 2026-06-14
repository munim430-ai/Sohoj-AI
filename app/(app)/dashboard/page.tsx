'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

        // Get user's organization
        const { data: userData } = await supabase
          .from('users')
          .select('organization_id')
          .eq('auth_id', user.id)
          .single()

        if (!userData) {
          router.push('/onboard')
          return
        }

        // Get organization details
        const { data: orgData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', userData.organization_id)
          .single()

        setOrganization(orgData)

        // Get stats
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ShahojAI</h1>
              <div className="hidden md:flex space-x-8">
                <Link href="/dashboard" className="text-gray-900 dark:text-white font-semibold">
                  Dashboard
                </Link>
                <Link href="/chat" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Chat
                </Link>
                <Link href="/settings" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Settings
                </Link>
              </div>
            </div>
            <Link href="/settings" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {organization && (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {organization.name}!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Here's your customer support activity overview.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Conversations</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalConversations}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">Total conversations</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border-l-4 border-green-500">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Credit Balance</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{organization.credit_balance}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">Credits remaining</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Documents</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.documentsCount}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">FAQ documents uploaded</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Plan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">
                  {organization.subscription_tier}
                </p>
                <Link
                  href="/billing"
                  className="text-blue-600 hover:text-blue-700 text-xs mt-2 inline-block font-semibold"
                >
                  Upgrade →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/chat"
                    className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">Start a Chat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Test your AI agent with a new conversation</p>
                  </Link>
                  <Link
                    href="/settings?tab=documents"
                    className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">Upload FAQ</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add new knowledge base documents</p>
                  </Link>
                  <Link
                    href="/billing"
                    className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">Buy Credits</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Purchase more API credits for conversations</p>
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Widget Setup
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
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
