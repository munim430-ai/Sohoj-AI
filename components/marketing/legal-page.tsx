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
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <div className="mb-8 rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong className="font-semibold">DRAFT — pending legal review.</strong> This document is
        placeholder boilerplate and is not yet legally binding.
      </div>

      <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="font-display text-2xl tracking-tight text-foreground">
              {i + 1}. {s.heading}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{s.body}</div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Questions?</p>
        <p className="mt-2">
          Contact us at{' '}
          <a href="mailto:munimm247@gmail.com" className="font-medium text-accent">
            munimm247@gmail.com
          </a>
          . sohojAI is operated by Keystone Consultancy, Dhaka, Bangladesh.
        </p>
      </div>
    </article>
  )
}
