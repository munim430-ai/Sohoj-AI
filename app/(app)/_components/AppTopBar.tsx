'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BrandMark } from '@/app/(marketing)/_components/Brand'

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'Chat' },
  { href: '/settings', label: 'Settings' },
  { href: '/billing', label: 'Billing' },
]

export function AppTopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [credits, setCredits] = useState<number | null>(null)
  const [tier, setTier] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/organization')
        if (!res.ok) return
        const org = await res.json()
        if (!active) return
        setCredits(org.credit_balance)
        setTier(org.subscription_tier)
      } catch {
        /* ignore — bar still renders */
      }
    })()
    return () => {
      active = false
    }
  }, [pathname])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const creditLabel =
    tier === 'enterprise' || credits === -1
      ? 'Unlimited'
      : credits === null
        ? '—'
        : credits.toLocaleString()

  return (
    <header className="app-bar">
      <div className="app-bar-inner">
        <Link href="/dashboard" className="app-brand" aria-label="ShahojAI dashboard">
          <BrandMark size={26} />
          <span>
            Shahoj<span className="app-brand-ai">AI</span>
          </span>
        </Link>

        <nav className="app-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav-link${pathname === item.href ? ' is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="app-bar-right">
          <Link href="/billing" className="app-credit-pill" title="Credit balance">
            <span className="app-credit-dot" />
            {creditLabel} <span className="app-credit-unit">credits</span>
          </Link>
          <button className="app-signout" onClick={signOut}>
            Sign out
          </button>
          <button
            className="app-burger"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="app-nav-mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav-link${pathname === item.href ? ' is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button className="app-signout" onClick={signOut}>
            Sign out
          </button>
        </nav>
      )}
    </header>
  )
}
