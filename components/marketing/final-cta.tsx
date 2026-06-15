import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '@/components/marketing/reveal'

export function FinalCta() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-6 py-20 text-center sm:px-12">
        <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1] tracking-tight text-background sm:text-5xl">
          We talk. You sell. <em className="italic text-background/90">Starting today.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-background/65">
          Join the Bangladeshi sellers letting AI handle every late-night chat, comment, and bKash
          payment — automatically.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/signup"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 sm:w-auto"
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#pricing"
            className="inline-flex w-full items-center justify-center rounded-full border border-background/20 bg-transparent px-7 py-3 text-sm font-medium text-background transition-colors hover:bg-background/10 sm:w-auto"
          >
            View pricing
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-background/60">
          {['No credit card', 'Setup in minutes', 'Cancel anytime'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-accent" />
              {t}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
