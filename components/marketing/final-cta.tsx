import { Reveal } from '@/components/marketing/reveal'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, CheckIcon } from '@/components/marketing/icons'

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-navy px-6 py-16 text-center shadow-glow sm:px-12 sm:py-20">
        {/* decorative glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-electric/30 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-azure/20 blur-3xl" />
        </div>

        <h2 className="mx-auto max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          We talk. You sell.
          <span className="block text-azure">Starting today.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          Join the Bangladeshi sellers letting AI handle every late-night chat, comment,
          and bKash payment — automatically.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/signup" variant="primary" size="lg" className="w-full bg-electric hover:bg-azure sm:w-auto">
            Start Free
            <ArrowRightIcon width={18} height={18} />
          </Button>
          <Button
            href="#pricing"
            variant="secondary"
            size="lg"
            className="w-full border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white sm:w-auto"
          >
            View pricing
          </Button>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
          {['No credit card', 'Setup in minutes', 'Cancel anytime'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckIcon width={15} height={15} className="text-azure" />
              {t}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
