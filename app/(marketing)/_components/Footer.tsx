import Link from 'next/link'
import { Brand } from './Brand'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/#features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/faq', label: 'FAQ' },
      { href: '/signup', label: 'Get started' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: 'mailto:careers@shahojai.com', label: 'Careers' },
      { href: 'mailto:hello@shahojai.com', label: 'hello@shahojai.com' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/legal/terms', label: 'Terms of Service' },
      { href: '/legal/privacy', label: 'Privacy Policy' },
      { href: '/legal/cookies', label: 'Cookie Policy' },
      { href: '/legal/dpa', label: 'Data Processing' },
      { href: '/legal/refund', label: 'Refund Policy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mk-footer">
      <div className="mk-container">
        <div className="mk-footer-grid">
          <div className="mk-footer-brand">
            <Brand />
            <p>
              AI customer support that speaks your customers&apos; language. Built in Bangladesh for
              Bangladeshi e-commerce.
            </p>
            <p style={{ marginTop: 12 }}>
              <a href="mailto:hello@shahojai.com" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 600 }}>
                hello@shahojai.com
              </a>
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="mk-footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    {l.href.startsWith('mailto:') ? (
                      <a href={l.href}>{l.label}</a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mk-footer-bottom">
          <span>© 2026 ShahojAI. All rights reserved. Made in Dhaka, Bangladesh 🇧🇩</span>
          <span style={{ display: 'inline-flex', gap: 18 }}>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <a href="mailto:hello@shahojai.com">Support</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
