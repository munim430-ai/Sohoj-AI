import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI customer support that speaks your customers’ language',
  description:
    'ShahojAI answers your customers in Bangla and English from your own FAQs — instantly, around the clock. Embeddable widget, white-label, aamarPay billing. Built for Bangladeshi e-commerce.',
}

const FEATURES = [
  {
    icon: '🎯',
    title: 'Grounded, accurate answers',
    body: 'Retrieval-augmented generation reads only your FAQs, policies and product docs — so replies stay on-brand and never invent prices or promises.',
  },
  {
    icon: '🌐',
    title: 'Bangla + English, natively',
    body: 'Customers ask in Bangla, Banglish or English. ShahojAI detects the language and replies in the same one — no awkward translations.',
  },
  {
    icon: '🏷️',
    title: 'Fully white-label',
    body: 'Your logo, your colours, your name. Customers never see ours. The widget feels like a native part of your store.',
  },
  {
    icon: '📊',
    title: 'Analytics that matter',
    body: 'See top questions, deflection rate, busiest hours and unanswered queries — then turn the gaps into new FAQs in one click.',
  },
  {
    icon: '💬',
    title: 'Embeddable in 2 minutes',
    body: 'One script tag drops a polished chat widget onto Shopify, WooCommerce, a landing page or a custom site. No code, no plugins.',
  },
  {
    icon: '💳',
    title: 'aamarPay billing',
    body: 'Pay in Taka with bKash, Nagad, cards or net banking. Top up credits when you need them — no foreign cards, no surprises.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Upload your FAQs',
    body: 'Paste your existing answers, drop a PDF, or sync a Google Sheet. ShahojAI indexes everything in seconds — return policy, delivery times, sizing, payment.',
  },
  {
    n: '2',
    title: 'Connect the widget',
    body: 'Copy one line of code into your store or share a hosted link. Match your brand colours and you’re live. No developer required.',
  },
  {
    n: '3',
    title: 'AI answers, day & night',
    body: 'Customers get instant, accurate replies in Bangla or English — at 2 PM or 2 AM. You step in only for the questions that truly need you.',
  },
]

const STATS = [
  { num: '90%', lbl: 'of repeat questions answered automatically' },
  { num: '0.8s', lbl: 'average first response time' },
  { num: '2 min', lbl: 'to embed on your store' },
  { num: '24/7', lbl: 'always-on, never sleeps' },
]

const QUOTES = [
  {
    text: 'During Eid rush we used to lose orders because we couldn’t reply fast enough. Now ShahojAI handles the “ডেলিভারি কবে?” questions and our team only touches real issues.',
    name: 'Tahmina R.',
    role: 'Founder, fashion store (illustrative)',
    initials: 'TR',
  },
  {
    text: 'Customers message in Banglish at midnight. It replies in the same style, pulls the right return policy, and it sounds like us. Setup took one afternoon.',
    name: 'Rafiul H.',
    role: 'Ops lead, electronics seller (illustrative)',
    initials: 'RH',
  },
  {
    text: 'We cut first-response time from hours to seconds and our inbox is finally calm. Paying in Taka through bKash made the decision easy.',
    name: 'Nusrat A.',
    role: 'Owner, beauty brand (illustrative)',
    initials: 'NA',
  },
]

export default function LandingPage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="mk-hero">
        <div className="mk-container mk-hero-grid">
          <div>
            <span className="mk-pill">
              <span className="mk-pill-badge">নতুন</span>
              Now answering in Bangla, Banglish &amp; English
            </span>

            <h1 className="mk-hero-title">
              Customer support that <span className="accent">speaks your customers&apos; language</span>.
            </h1>

            <p className="mk-hero-sub">
              ShahojAI is an AI support agent trained on your own FAQs. It answers 90% of repeat
              questions instantly — in Bangla or English — so your team can stop copy-pasting and
              start selling.
            </p>

            <div className="mk-hero-cta">
              <Link href="/signup" className="mk-btn mk-btn-primary mk-btn-lg">
                Start free →
              </Link>
              <Link href="/#demo" className="mk-btn mk-btn-ghost mk-btn-lg">
                See it in action
              </Link>
            </div>

            <div className="mk-hero-meta">
              <span className="mk-hero-meta-item">
                <span className="mk-check">✓</span> No card to start
              </span>
              <span className="mk-hero-meta-item">
                <span className="mk-check">✓</span> Live in under 5 minutes
              </span>
              <span className="mk-hero-meta-item">
                <span className="mk-check">✓</span> Pay in ৳ with bKash/Nagad
              </span>
            </div>
          </div>

          {/* Product visual */}
          <div style={{ position: 'relative' }}>
            <div className="mk-mock">
              <div className="mk-mock-bar">
                <span className="mk-mock-avatar">S</span>
                <div style={{ flex: 1 }}>
                  <div className="mk-mock-title">Shitol Bazar · Support</div>
                  <div className="mk-mock-status">Online · replies instantly</div>
                </div>
              </div>
              <div className="mk-mock-body">
                <div className="mk-bubble mk-bubble-user">ডেলিভারি কত দিনে পাবো ঢাকার বাইরে?</div>
                <div>
                  <div className="mk-bubble mk-bubble-bot">
                    ঢাকার বাইরে সাধারণত ৩–৫ কর্মদিবসে ডেলিভারি হয়। ক্যাশ অন ডেলিভারিও আছে। কোন এলাকার
                    জন্য জানতে চাইছেন?
                  </div>
                  <span className="mk-bubble-src">📄 Source: Delivery &amp; Shipping FAQ</span>
                </div>
                <div className="mk-bubble mk-bubble-user">Can I return if size doesn&apos;t fit?</div>
                <div className="mk-bubble mk-bubble-bot">
                  Yes — easy 7-day returns on unworn items with tags. Want me to start a return for
                  your last order?
                </div>
              </div>
              <div className="mk-mock-input">
                <div className="mk-mock-input-field">Type your message…</div>
                <span className="mk-mock-send">↑</span>
              </div>
            </div>

            <div className="mk-mock-float mk-mock-float-tr">
              <div className="mk-mock-float-num">0.8s</div>
              <div className="mk-mock-float-lbl">avg. reply</div>
            </div>
            <div className="mk-mock-float mk-mock-float-bl">
              <div className="mk-mock-float-num">90%</div>
              <div className="mk-mock-float-lbl">auto-resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUSTED BY ---------------- */}
      <section className="mk-trust">
        <div className="mk-container mk-trust-inner">
          <div className="mk-trust-label">Built for the stores that power Bangladeshi commerce</div>
          <div className="mk-trust-logos">
            <span className="mk-trust-logo">Daraz sellers</span>
            <span className="mk-trust-logo">Shopify</span>
            <span className="mk-trust-logo">WooCommerce</span>
            <span className="mk-trust-logo">F-commerce</span>
            <span className="mk-trust-logo">bKash</span>
            <span className="mk-trust-logo">Nagad</span>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mk-section" id="how-it-works">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-eyebrow">
              <span className="mk-eyebrow-dot" /> How it works
            </span>
            <h2 className="mk-h2">Live in three simple steps.</h2>
            <p className="mk-lead">
              No data science, no integrations team. If you can copy and paste, you can launch
              ShahojAI today.
            </p>
          </div>

          <div className="mk-steps">
            {STEPS.map((s) => (
              <div className="mk-step" key={s.n}>
                <span className="mk-step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="mk-section" id="features" style={{ background: 'var(--mk-bg-tint)' }}>
        <div className="mk-container">
          <div className="mk-section-head center">
            <span className="mk-eyebrow">
              <span className="mk-eyebrow-dot" /> Why ShahojAI
            </span>
            <h2 className="mk-h2">Everything you need to support customers at scale.</h2>
            <p className="mk-lead">
              Built specifically for how Bangladeshi e-commerce actually works — language, payments
              and all.
            </p>
          </div>

          <div className="mk-features">
            {FEATURES.map((f) => (
              <div className="mk-feature" key={f.title}>
                <span className="mk-feature-icon" aria-hidden="true">
                  {f.icon}
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- DEMO SPLIT ---------------- */}
      <section className="mk-section" id="demo">
        <div className="mk-container mk-split">
          <div>
            <span className="mk-eyebrow">
              <span className="mk-eyebrow-dot" /> See it work
            </span>
            <h2 className="mk-h2">It reads your docs, then answers like your best agent.</h2>
            <p className="mk-lead">
              Every reply is grounded in your own content and cites where it came from. When it isn&apos;t
              sure, it hands the conversation to your team — politely, in the customer&apos;s language.
            </p>
            <ul className="mk-split-list">
              <li>
                <span className="mk-split-ic">✓</span>
                <div>
                  <strong>Grounded in your content</strong>
                  <p>No hallucinated prices or policies — answers come straight from your FAQs.</p>
                </div>
              </li>
              <li>
                <span className="mk-split-ic">✓</span>
                <div>
                  <strong>Smart handoff</strong>
                  <p>Unclear or sensitive queries are routed to a human with full context attached.</p>
                </div>
              </li>
              <li>
                <span className="mk-split-ic">✓</span>
                <div>
                  <strong>Always improving</strong>
                  <p>Unanswered questions become suggested FAQs, so coverage grows every week.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mk-split-visual">
            <div className="mk-mock">
              <div className="mk-mock-bar">
                <span className="mk-mock-avatar">A</span>
                <div style={{ flex: 1 }}>
                  <div className="mk-mock-title">Aroma Beauty · Helpdesk</div>
                  <div className="mk-mock-status">AI agent · grounded answers</div>
                </div>
              </div>
              <div className="mk-mock-body" style={{ minHeight: 300 }}>
                <div className="mk-bubble mk-bubble-user">এই সিরামটা কি অয়েলি স্কিনের জন্য ঠিক আছে?</div>
                <div>
                  <div className="mk-bubble mk-bubble-bot">
                    হ্যাঁ, এই নিয়াসিনামাইড সিরামটি অয়েলি ও কম্বিনেশন স্কিনের জন্য উপযুক্ত। দিনে ১ বার,
                    ময়েশ্চারাইজারের আগে ব্যবহার করবেন।
                  </div>
                  <span className="mk-bubble-src">📄 Source: Product · Niacinamide Serum</span>
                </div>
                <div className="mk-bubble mk-bubble-user">price ar offer ki ace akhon?</div>
                <div>
                  <div className="mk-bubble mk-bubble-bot">
                    এখন ৳৮৫০, ঈদ অফারে ১৫% ছাড় চলছে ✨ অর্ডার করতে চাইলে সাহায্য করতে পারি।
                  </div>
                  <span className="mk-bubble-src">📄 Source: Pricing &amp; Offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="mk-section-tight" style={{ background: 'var(--mk-bg-tint)' }}>
        <div className="mk-container">
          <div className="mk-stats">
            {STATS.map((s) => (
              <div className="mk-stat" key={s.lbl}>
                <div className="mk-stat-num">{s.num}</div>
                <div className="mk-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12.5, marginTop: 16 }}>
            Figures are illustrative targets based on typical FAQ-heavy support volumes.
          </p>
        </div>
      </section>

      {/* ---------------- PRICING TEASER ---------------- */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-section-head center">
            <span className="mk-eyebrow">
              <span className="mk-eyebrow-dot" /> Pricing
            </span>
            <h2 className="mk-h2">Simple Taka pricing. Pay only for what you use.</h2>
            <p className="mk-lead">
              Start free, then choose a plan that scales with your store. No foreign cards required.
            </p>
          </div>

          <div className="mk-price-grid">
            <div className="mk-price-card">
              <div className="mk-price-name">STARTER</div>
              <div className="mk-price-desc">For new and growing stores testing automation.</div>
              <div className="mk-price-amount">
                <span className="cur">৳</span>
                <span className="num">2,500</span>
                <span className="per">/mo</span>
              </div>
              <div className="mk-price-credits">500 answer credits / month</div>
              <div className="mk-price-cta">
                <Link href="/signup" className="mk-btn mk-btn-ghost">
                  Start free
                </Link>
              </div>
            </div>

            <div className="mk-price-card featured">
              <span className="mk-price-tag">Most popular</span>
              <div className="mk-price-name">PRO</div>
              <div className="mk-price-desc">For busy stores that live in the inbox.</div>
              <div className="mk-price-amount">
                <span className="cur">৳</span>
                <span className="num">8,000</span>
                <span className="per">/mo</span>
              </div>
              <div className="mk-price-credits">2,000 answer credits / month</div>
              <div className="mk-price-cta">
                <Link href="/signup" className="mk-btn mk-btn-primary">
                  Get started
                </Link>
              </div>
            </div>

            <div className="mk-price-card">
              <div className="mk-price-name">ENTERPRISE</div>
              <div className="mk-price-desc">For brands and agencies running at volume.</div>
              <div className="mk-price-amount">
                <span className="num">Custom</span>
              </div>
              <div className="mk-price-credits">Unlimited answers · SLA · onboarding</div>
              <div className="mk-price-cta">
                <Link href="/contact" className="mk-btn mk-btn-ghost">
                  Talk to us
                </Link>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/pricing" className="mk-btn-link">
              Compare all plans &amp; features →
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="mk-section" style={{ background: 'var(--mk-bg-tint)' }}>
        <div className="mk-container">
          <div className="mk-section-head center">
            <span className="mk-eyebrow">
              <span className="mk-eyebrow-dot" /> Loved by operators
            </span>
            <h2 className="mk-h2">Less inbox chaos. More closed orders.</h2>
            <p className="mk-lead">
              Stories below are illustrative, written to reflect the outcomes ShahojAI is built to
              deliver.
            </p>
          </div>

          <div className="mk-quotes">
            {QUOTES.map((q) => (
              <figure className="mk-quote" key={q.name}>
                <div className="mk-quote-stars" aria-hidden="true">
                  ★★★★★
                </div>
                <blockquote className="mk-quote-text">“{q.text}”</blockquote>
                <figcaption className="mk-quote-by">
                  <span className="mk-quote-avatar">{q.initials}</span>
                  <span>
                    <span className="mk-quote-name">{q.name}</span>
                    <br />
                    <span className="mk-quote-role">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-cta-band">
            <div className="mk-cta-inner">
              <h2>Give every customer an instant, fluent reply.</h2>
              <p>
                Set up ShahojAI in minutes and let it handle the questions you answer a hundred times
                a day — in the language your customers actually speak.
              </p>
              <div className="mk-cta-actions">
                <Link href="/signup" className="mk-btn mk-btn-white mk-btn-lg">
                  Start free →
                </Link>
                <Link href="/contact" className="mk-btn mk-btn-outline mk-btn-lg">
                  Book a walkthrough
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
