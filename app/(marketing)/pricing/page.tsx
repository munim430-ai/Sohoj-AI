import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple Taka pricing for ShahojAI. Starter ৳2,500/mo, Pro ৳8,000/mo, Enterprise custom. Pay with bKash, Nagad or card via aamarPay.',
}

const TIERS = [
  {
    name: 'STARTER',
    desc: 'For new and growing stores testing automation.',
    cur: '৳',
    price: '2,500',
    per: '/mo',
    credits: '500 answer credits / month',
    cta: { label: 'Start free', href: '/signup', variant: 'mk-btn-ghost' },
    featured: false,
    feats: [
      '1 AI agent',
      'Bangla + English answers',
      'Embeddable chat widget',
      'Upload FAQs, PDFs & sheets',
      'Basic analytics dashboard',
      'Email support',
    ],
    muted: ['Remove ShahojAI branding', 'Custom domain widget', 'Priority support'],
  },
  {
    name: 'PRO',
    desc: 'For busy stores that live in the inbox.',
    cur: '৳',
    price: '8,000',
    per: '/mo',
    credits: '2,000 answer credits / month',
    cta: { label: 'Get started', href: '/signup', variant: 'mk-btn-primary' },
    featured: true,
    feats: [
      'Everything in Starter',
      '3 AI agents / storefronts',
      'Full white-label (no branding)',
      'Custom brand colours & logo',
      'Smart human handoff',
      'Advanced analytics & exports',
      'Top-up credits anytime',
      'Priority email + chat support',
    ],
    muted: ['Dedicated success manager', 'SLA & uptime guarantee'],
  },
  {
    name: 'ENTERPRISE',
    desc: 'For brands and agencies running at volume.',
    cur: '',
    price: 'Custom',
    per: '',
    credits: 'Unlimited answers',
    cta: { label: 'Talk to us', href: '/contact', variant: 'mk-btn-ghost' },
    featured: false,
    feats: [
      'Everything in Pro',
      'Unlimited agents & credits',
      'Multi-brand / agency workspace',
      'Dedicated success manager',
      'SLA & 99.9% uptime',
      'Custom integrations & API',
      'Onboarding & training',
      'Invoiced billing',
    ],
    muted: [],
  },
]

const COMPARE: { label: string; values: [string, string, string] }[] = [
  { label: 'Monthly answer credits', values: ['500', '2,000', 'Unlimited'] },
  { label: 'AI agents / storefronts', values: ['1', '3', 'Unlimited'] },
  { label: 'Bangla + English answers', values: ['yes', 'yes', 'yes'] },
  { label: 'Embeddable widget', values: ['yes', 'yes', 'yes'] },
  { label: 'White-label (no branding)', values: ['no', 'yes', 'yes'] },
  { label: 'Custom brand colours & logo', values: ['no', 'yes', 'yes'] },
  { label: 'Smart human handoff', values: ['no', 'yes', 'yes'] },
  { label: 'Advanced analytics & exports', values: ['no', 'yes', 'yes'] },
  { label: 'Credit top-ups', values: ['no', 'yes', 'yes'] },
  { label: 'API & custom integrations', values: ['no', 'no', 'yes'] },
  { label: 'Dedicated success manager', values: ['no', 'no', 'yes'] },
  { label: 'SLA & uptime guarantee', values: ['no', 'no', 'yes'] },
]

const BILLING_FAQ = [
  {
    q: 'What is an “answer credit”?',
    a: 'One credit is consumed each time ShahojAI generates an AI reply to a customer. Browsing the chat, follow-up clicks and human messages don’t cost credits — only AI answers do.',
  },
  {
    q: 'How do I pay? Do I need a foreign card?',
    a: 'No foreign card needed. Billing runs through aamarPay, so you can pay in Bangladeshi Taka with bKash, Nagad, Rocket, debit/credit cards or net banking.',
  },
  {
    q: 'What happens if I run out of credits?',
    a: 'On Pro and Enterprise you can top up instantly. On Starter, the agent pauses AI replies until the next cycle or an upgrade — your widget stays live and routes to your team.',
  },
  {
    q: 'Can I change or cancel my plan?',
    a: 'Yes. Upgrade, downgrade or cancel anytime from your billing dashboard. Changes apply from the next billing cycle and unused time on an upgrade is prorated.',
  },
  {
    q: 'Is there a free trial?',
    a: 'You can create an account and configure your agent for free. You only pay once you’re ready to go live and start serving real customers.',
  },
]

function Cell({ v }: { v: string }) {
  if (v === 'yes') return <span className="yes">✓</span>
  if (v === 'no') return <span className="no">—</span>
  return <span>{v}</span>
}

export default function PricingPage() {
  return (
    <>
      <section className="mk-page-hero">
        <div className="mk-container">
          <span className="mk-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="mk-eyebrow-dot" /> Pricing
          </span>
          <h1>Pricing that scales with your store.</h1>
          <p>
            Pay in Taka, only for the answers you use. No setup fees, no foreign cards, no lock-in.
          </p>
        </div>
      </section>

      <section className="mk-section-tight">
        <div className="mk-container">
          <div className="mk-price-grid">
            {TIERS.map((t) => (
              <div className={`mk-price-card${t.featured ? ' featured' : ''}`} key={t.name}>
                {t.featured && <span className="mk-price-tag">Most popular</span>}
                <div className="mk-price-name">{t.name}</div>
                <div className="mk-price-desc">{t.desc}</div>
                <div className="mk-price-amount">
                  {t.cur && <span className="cur">{t.cur}</span>}
                  <span className="num">{t.price}</span>
                  {t.per && <span className="per">{t.per}</span>}
                </div>
                <div className="mk-price-credits">{t.credits}</div>
                <div className="mk-price-cta">
                  <Link href={t.cta.href} className={`mk-btn ${t.cta.variant}`}>
                    {t.cta.label}
                  </Link>
                </div>
                <ul className="mk-price-feats">
                  {t.feats.map((f) => (
                    <li key={f}>
                      <span className="mk-check">✓</span>
                      {f}
                    </li>
                  ))}
                  {t.muted.map((f) => (
                    <li className="muted" key={f}>
                      <span>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5 }}>
            All prices in BDT, billed monthly via aamarPay (bKash · Nagad · cards · net banking).
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-section-head center">
            <h2 className="mk-h2">Compare every feature.</h2>
            <p className="mk-lead">A clear look at what’s included in each plan.</p>
          </div>

          <div className="mk-compare-wrap">
            <table className="mk-compare">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th>Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>
                      <Cell v={row.values[0]} />
                    </td>
                    <td>
                      <Cell v={row.values[1]} />
                    </td>
                    <td>
                      <Cell v={row.values[2]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Billing FAQ */}
      <section className="mk-section" style={{ background: 'var(--mk-bg-tint)' }}>
        <div className="mk-container">
          <div className="mk-section-head center">
            <span className="mk-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="mk-eyebrow-dot" /> Billing FAQ
            </span>
            <h2 className="mk-h2">Questions about billing.</h2>
          </div>

          <div className="mk-mini-faq">
            {BILLING_FAQ.map((f) => (
              <div
                className="mk-contact-card"
                key={f.q}
                style={{ background: '#fff', marginBottom: 14 }}
              >
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-cta-band">
            <div className="mk-cta-inner">
              <h2>Ready to put support on autopilot?</h2>
              <p>Start free today. Upgrade only when ShahojAI is already earning its keep.</p>
              <div className="mk-cta-actions">
                <Link href="/signup" className="mk-btn mk-btn-white mk-btn-lg">
                  Start free →
                </Link>
                <Link href="/contact" className="mk-btn mk-btn-outline mk-btn-lg">
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
