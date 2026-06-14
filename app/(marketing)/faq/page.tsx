'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    q: 'What exactly is ShahojAI?',
    a: 'ShahojAI is an AI customer-support agent for online stores. You give it your FAQs, policies and product info, and it answers customer questions automatically — in Bangla or English — through a chat widget on your website or store.',
  },
  {
    q: 'Does it really understand Bangla and Banglish?',
    a: 'Yes. Customers can write in Bangla script, romanized Banglish, or English. ShahojAI detects the language of each message and replies in the same one, in a natural, on-brand tone.',
  },
  {
    q: 'How does it know the right answers?',
    a: 'It uses retrieval-augmented generation (RAG). When a customer asks something, ShahojAI searches your uploaded content for the most relevant passages and answers strictly from them — so it won’t invent prices, policies or promises.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most stores are live in under five minutes. Upload or paste your FAQs, copy one line of code into your site (or use the hosted link), match your brand colours, and you’re done. No developer required.',
  },
  {
    q: 'Where can I embed the widget?',
    a: 'Anywhere you can paste a script tag — Shopify, WooCommerce, a custom site, or a simple landing page. You can also share a hosted chat link directly in bios, ads or messages.',
  },
  {
    q: 'Can I make it look like my own brand?',
    a: 'On Pro and Enterprise the widget is fully white-label: your logo, your colours, your name. Customers never see ShahojAI branding — it feels like a native part of your store.',
  },
  {
    q: 'What happens when the AI doesn’t know something?',
    a: 'Instead of guessing, it tells the customer politely and hands the conversation to your team with full context. Unanswered questions also become suggested FAQs, so coverage keeps improving.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Plans are billed monthly in Taka and include a set number of answer credits — one credit per AI reply. Starter is ৳2,500/mo (500 credits), Pro is ৳8,000/mo (2,000 credits), and Enterprise is custom with unlimited answers. See the pricing page for the full comparison.',
  },
  {
    q: 'How do I pay? Do I need a foreign card?',
    a: 'No foreign card needed. Billing runs through aamarPay, so you can pay in Bangladeshi Taka using bKash, Nagad, Rocket, debit/credit cards or net banking.',
  },
  {
    q: 'What is an answer credit, and what if I run out?',
    a: 'A credit is used each time the AI generates a reply. On Pro and Enterprise you can top up instantly. On Starter, AI replies pause until the next cycle or an upgrade — your widget stays live and routes messages to your team in the meantime.',
  },
  {
    q: 'Is my data safe and private?',
    a: 'Yes. Each store is fully isolated in a multi-tenant architecture, your content is never used to train shared models, and everything is stored securely. Your data stays yours.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Upgrade, downgrade or cancel whenever you like from your billing dashboard. Changes take effect from the next billing cycle, with no lock-in.',
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`mk-acc-item${open ? ' open' : ''}`}>
      <button
        type="button"
        className="mk-acc-q"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {q}
        <span className="mk-acc-icon" aria-hidden="true" />
      </button>
      {open && <div className="mk-acc-a">{a}</div>}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <section className="mk-page-hero">
        <div className="mk-container">
          <span className="mk-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="mk-eyebrow-dot" /> FAQ
          </span>
          <h1>Frequently asked questions.</h1>
          <p>Everything you need to know about ShahojAI. Can’t find your answer? We’re one email away.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-container" style={{ maxWidth: 820 }}>
          <div className="mk-acc">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>

          <div
            className="mk-contact-card"
            style={{ marginTop: 32, textAlign: 'center', background: 'var(--mk-bg-tint)' }}
          >
            <h3>Still have a question?</h3>
            <p style={{ marginBottom: 14 }}>
              Email us at{' '}
              <a
                href="mailto:hello@shahojai.com"
                style={{ color: '#1a73e8', fontWeight: 600, textDecoration: 'none' }}
              >
                hello@shahojai.com
              </a>{' '}
              or reach out through our contact page.
            </p>
            <Link href="/contact" className="mk-btn mk-btn-primary">
              Contact us →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
