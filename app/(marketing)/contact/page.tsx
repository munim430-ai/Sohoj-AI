'use client'

import { useState } from 'react'

const CONTACT_CARDS = [
  {
    title: 'Sales & demos',
    body: 'See ShahojAI on your own store before you commit.',
    link: { label: 'hello@shahojai.com', href: 'mailto:hello@shahojai.com' },
  },
  {
    title: 'Support',
    body: 'Already a customer? We usually reply within a few hours.',
    link: { label: 'support@shahojai.com', href: 'mailto:support@shahojai.com' },
  },
  {
    title: 'WhatsApp / call',
    body: 'Sat–Thu, 10 AM – 7 PM (GMT+6), Dhaka.',
    link: { label: '+880 1700 000000', href: 'tel:+8801700000000' },
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    topic: 'Sales',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // No backend in this build — open the user's mail client as a graceful fallback.
    const subject = encodeURIComponent(`[${form.topic}] Inquiry from ${form.name || 'website'}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nTopic: ${form.topic}\n\n${form.message}`
    )
    window.location.href = `mailto:hello@shahojai.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <section className="mk-page-hero">
        <div className="mk-container">
          <span className="mk-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="mk-eyebrow-dot" /> Contact
          </span>
          <h1>Let’s talk.</h1>
          <p>
            Questions about setup, pricing or a custom plan? Reach out — a real human in Dhaka will
            get back to you.
          </p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-container mk-contact-grid">
          {/* Left: options */}
          <div>
            <h2 className="mk-h2" style={{ fontSize: 24, marginBottom: 20 }}>
              Ways to reach us
            </h2>
            {CONTACT_CARDS.map((c) => (
              <div className="mk-contact-card" key={c.title}>
                <h3>{c.title}</h3>
                <p style={{ marginBottom: 8 }}>{c.body}</p>
                <a href={c.link.href}>{c.link.label}</a>
              </div>
            ))}
            <p style={{ fontSize: 13.5, marginTop: 8 }}>
              Prefer email? Write to{' '}
              <a
                href="mailto:hello@shahojai.com"
                style={{ color: '#1a73e8', fontWeight: 600, textDecoration: 'none' }}
              >
                hello@shahojai.com
              </a>{' '}
              and we’ll take it from there.
            </p>
          </div>

          {/* Right: form */}
          <div>
            <form className="mk-form" onSubmit={handleSubmit}>
              {sent && (
                <div className="mk-form-success">
                  Thanks! We’ve opened your email app to send this to hello@shahojai.com. If nothing
                  happened, email us directly — we’ll reply shortly.
                </div>
              )}

              <div className="mk-field-row">
                <div className="mk-field">
                  <label htmlFor="c-name">Full name</label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your name"
                  />
                </div>
                <div className="mk-field">
                  <label htmlFor="c-email">Work email</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@store.com"
                  />
                </div>
              </div>

              <div className="mk-field-row">
                <div className="mk-field">
                  <label htmlFor="c-company">Store / company</label>
                  <input
                    id="c-company"
                    type="text"
                    value={form.company}
                    onChange={update('company')}
                    placeholder="Your business name"
                  />
                </div>
                <div className="mk-field">
                  <label htmlFor="c-topic">What’s this about?</label>
                  <select id="c-topic" value={form.topic} onChange={update('topic')}>
                    <option>Sales</option>
                    <option>Demo request</option>
                    <option>Support</option>
                    <option>Enterprise / agency</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mk-field">
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us a little about your store and what you need…"
                />
              </div>

              <button type="submit" className="mk-btn mk-btn-primary mk-btn-lg">
                Send message →
              </button>
              <p className="mk-form-note">
                By submitting you agree to be contacted about ShahojAI. We never share your details.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
