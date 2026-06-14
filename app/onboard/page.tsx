'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function OnboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAndSetup = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Check if user already has organization
        const { data: userData } = await supabase
          .from('users')
          .select('organization_id')
          .eq('auth_id', user.id)
          .single()

        if (userData) {
          router.push('/dashboard')
          return
        }

        // If no organization, redirect to create one
        const companyName = 'My Company'
        const slug = `company-${Date.now().toString().slice(-6)}`

        const response = await fetch('/api/organization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            name: companyName,
            slug,
          }),
        })

        if (response.ok) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Onboarding error:', error)
      }
    }

    checkAndSetup()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Setting up your account...</h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we prepare your workspace.</p>
      </div>
    </div>
  )
}
