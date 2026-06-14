import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'ShahojAI is on a mission to make world-class customer support effortless for Bangladeshi e-commerce. Built in Dhaka, in Bangla and English.',
}

const VALUES = [
  {
    icon: '🤝',
    title: 'Customer obsession, literally',
    body: 'Every feature exists to help your customer get a fast, honest answer. If it doesn’t serve that, we don’t build it.',
  },
  {
    icon: '🇧🇩',
    title: 'Locally rooted',
    body: 'We build for how commerce really happens here — Banglish DMs, COD questions, Eid rushes and bKash payments.',
  },
  {
    icon: '🎯',
    title: 'Honest answers only',
    body: 'No invented prices, no fake promises. Our AI stays grounded in your content and admits when it should hand off.',
  },
  {
    icon: '⚡',
    title: 'Fast, like Shahoj',
    body: '“Shahoj” means easy. Setup in minutes, answers in under a second, and pricing you can read in one glance.',
  },
  {
    icon: '🔒',
    title: 'Trust by default',
    body: 'Your data is yours. We isolate every tenant, never train shared models on your content, and keep it secure.',
  },
  {
    icon: '🌍',
    title: 'World-class, from here',
    body: 'Stripe-level polish, built in Dhaka. We believe a tool made in Bangladesh can lead, not follow.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="mk-page-hero">
        <div className="mk-container">
          <span className="mk-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="mk-eyebrow-dot" /> Our mission
          </span>
          <h1>Make great support effortless for every Bangladeshi seller.</h1>
          <p>
            We’re building the AI support layer for the next generation of e-commerce in
            Bangladesh — fluent in your customers’ language, and easy enough for anyone to run.
          </p>
        </div>
      </section>

      {/* The why */}
      <section className="mk-section">
        <div className="mk-container mk-prose">
          <p>
            <strong>Customer support is quietly broken for small e-commerce in Bangladesh.</strong>{' '}
            A founder answers the same questions — “ডেলিভারি কবে?”, “return hoy?”, “price koto?” —
            dozens of times a day, often at midnight, often in Banglish, across five different inboxes.
          </p>
          <p>
            The tools built abroad don’t fit. They assume English-only customers, foreign credit
            cards, and a support team that doesn’t exist yet. So sellers do it all by hand, lose
            orders during rush hours, and burn out doing work a machine should handle.
          </p>
          <p>
            We started ShahojAI because we’ve lived this. <strong>Shahoj</strong> means{' '}
            <strong>easy</strong> — and that’s the promise. Drop in your FAQs, paste one line of
            code, and a polished AI agent starts answering customers in their own language, instantly,
            around the clock. You step in only when it genuinely matters.
          </p>
          <p>
            The result is simple: <strong>calmer inboxes, faster replies, and more closed orders</strong>{' '}
            — without hiring a support team or fighting with foreign software.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mk-section" style={{ background: 'var(--mk-bg-tint)' }}>
        <div className="mk-container">
          <div className="mk-section-head center">
            <span className="mk-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="mk-eyebrow-dot" /> What we value
            </span>
            <h2 className="mk-h2">The principles we build on.</h2>
          </div>

          <div className="mk-values">
            {VALUES.map((v) => (
              <div className="mk-value" key={v.title}>
                <span className="mk-feature-icon" aria-hidden="true">
                  {v.icon}
                </span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Made in BD */}
      <section className="mk-section">
        <div className="mk-container mk-split">
          <div>
            <span className="mk-eyebrow">
              <span className="mk-eyebrow-dot" /> Made in Bangladesh
            </span>
            <h2 className="mk-h2">Built in Dhaka, for the world we shop in.</h2>
            <p className="mk-lead">
              We’re a small team of engineers and operators who grew up buying and selling online in
              Bangladesh. We understand Banglish, COD, page-based selling and the chaos of an Eid
              sale — because we’ve been on both sides of the chat.
            </p>
            <p className="mk-lead">
              That local knowledge is our edge. We’re proving that a product built here can match the
              polish of anything from the Valley — and serve our market far better.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link href="/contact" className="mk-btn mk-btn-primary mk-btn-lg">
                Work with us →
              </Link>
            </div>
          </div>

          <div className="mk-split-visual">
            <div className="mk-stats" style={{ borderRadius: 18 }}>
              <div className="mk-stat">
                <div className="mk-stat-num">2 langs</div>
                <div className="mk-stat-lbl">Bangla &amp; English, natively</div>
              </div>
              <div className="mk-stat">
                <div className="mk-stat-num">৳ only</div>
                <div className="mk-stat-lbl">Local Taka billing via aamarPay</div>
              </div>
              <div className="mk-stat">
                <div className="mk-stat-num">24/7</div>
                <div className="mk-stat-lbl">Support that never clocks out</div>
              </div>
              <div className="mk-stat">
                <div className="mk-stat-num">Dhaka</div>
                <div className="mk-stat-lbl">Where we design and build</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-cta-band">
            <div className="mk-cta-inner">
              <h2>Join us in making support shahoj.</h2>
              <p>Whether you’re a seller or a builder, we’d love to have you on the journey.</p>
              <div className="mk-cta-actions">
                <Link href="/signup" className="mk-btn mk-btn-white mk-btn-lg">
                  Start free →
                </Link>
                <Link href="/contact" className="mk-btn mk-btn-outline mk-btn-lg">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
