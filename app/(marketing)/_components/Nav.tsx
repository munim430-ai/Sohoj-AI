'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brand } from './Brand'

const LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="mk-nav">
      <div className="mk-container mk-nav-inner">
        <Brand />

        <nav aria-label="Primary">
          <ul className="mk-nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mk-nav-actions">
          <Link href="/login" className="mk-nav-signin">
            Sign in
          </Link>
          <Link href="/signup" className="mk-btn mk-btn-primary">
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="mk-nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="mk-mobile-menu">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mk-mobile-actions">
            <Link href="/login" className="mk-btn mk-btn-ghost" onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link href="/signup" className="mk-btn mk-btn-primary" onClick={() => setOpen(false)}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
