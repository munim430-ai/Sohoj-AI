import * as React from 'react'

export type LegalSection = { heading: string; body: React.ReactNode }

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <div className="mb-8 rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong className="font-semibold">DRAFT — pending legal review.</strong> This
        document is placeholder boilerplate and is not yet legally binding.
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-navy/45">Last updated: {updated}</p>
      <p className="mt-6 text-lg leading-relaxed text-navy/65">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-semibold text-navy">
              {i + 1}. {s.heading}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-navy/65">{s.body}</div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy/10 bg-white p-6 text-sm text-navy/65">
        <p className="font-display font-semibold text-navy">Questions?</p>
        <p className="mt-2">
          Contact us at{' '}
          <a href="mailto:munimm247@gmail.com" className="font-medium text-electric">
            munimm247@gmail.com
          </a>
          . sohojAI is operated by Keystone Consultancy, Dhaka, Bangladesh.
        </p>
      </div>
    </article>
  )
}
