'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Organization {
  id: string
  name: string
  subscription_tier: 'starter' | 'pro' | 'enterprise'
  credit_balance: number
}

const PLANS = {
  starter: { name: 'Starter', credits: 500, price: '৳2,500/month' },
  pro: { name: 'Pro', credits: 2000, price: '৳8,000/month' },
  enterprise: { name: 'Enterprise', credits: 'Unlimited', price: 'Contact us' },
}

const CREDIT_PACKS = [
  { credits: 100, price: 100 },
  { credits: 500, price: 450 },
  { credits: 1000, price: 800 },
  { credits: 5000, price: 3500 },
]

export default function BillingPage() {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

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
      } catch (error) {
        console.error('Error loading billing:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrganization()
  }, [router])

  const handleBuyCredits = async (credits: number, price: number) => {
    if (!organization) return

    setPurchasing(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: organization.id,
          amount: price,
          creditsToAdd: credits,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to initiate payment')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Billing &amp; Plans</h1>
        {organization && (
          <>
            <div className="mb-12 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Current Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 uppercase font-semibold">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize mt-2">
                    {organization.subscription_tier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 uppercase font-semibold">Credits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {organization.subscription_tier === 'enterprise'
                      ? 'Unlimited'
                      : organization.credit_balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 uppercase font-semibold">Next Billing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(PLANS).map(([tier, plan]) => (
                  <div
                    key={tier}
                    className={`rounded-lg p-6 ${
                      organization.subscription_tier === tier
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className={organization.subscription_tier === tier ? 'text-white' : 'text-gray-600 dark:text-gray-400'}>
                      {plan.price}
                    </p>
                    <p className={`text-2xl font-bold my-4 ${organization.subscription_tier === tier ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {plan.credits} credits
                    </p>
                    {organization.subscription_tier === tier && (
                      <div className="text-green-200 font-semibold">Current Plan</div>
                    )}
                    {organization.subscription_tier !== tier && (
                      <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                        Upgrade
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Buy Additional Credits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CREDIT_PACKS.map((pack) => (
                  <div
                    key={pack.credits}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center"
                  >
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{pack.credits}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Credits</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">৳{pack.price.toLocaleString()}</p>
                    <button
                      onClick={() => handleBuyCredits(pack.credits, pack.price)}
                      disabled={purchasing}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
                    >
                      {purchasing ? 'Processing...' : 'Buy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
