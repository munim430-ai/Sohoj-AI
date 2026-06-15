import { Reveal, RevealStagger, RevealItem } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@/components/marketing/icons'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: '৳0',
    period: 'forever',
    tagline: 'Prove the value, risk-free.',
    cta: 'Start Free',
    featured: false,
    features: [
      '1 Facebook Page',
      '10 sales conversations / month',
      '5 products · 3 monitored posts',
      'Bangla · Banglish · English replies',
      'Limited Comment-to-Order',
      '5 abandoned-sales recoveries / month',
      '30-day conversation history',
    ],
  },
  {
    name: 'Basic',
    price: '৳1,999',
    period: '/month',
    tagline: 'For solo sellers & small Facebook businesses.',
    cta: 'Start Free',
    featured: true,
    features: [
      '500 sales conversations / month',
      '200 products · unlimited posts',
      'Full Comment-to-Order automation',
      '300 abandoned-sales recoveries / month',
      'Shared inbox & human takeover',
      'bKash tracker — 3,000 trx / month',
      'Google Sheets import/export',
      'Full revenue & conversion analytics',
    ],
  },
  {
    name: 'Pro',
    price: '৳4,999',
    period: '/month',
    tagline: 'For established businesses & sales teams.',
    cta: 'Start Free',
    featured: false,
    features: [
      'Up to 5 Facebook Pages',
      '5,000 sales conversations / month',
      'Unlimited products',
      'Up to 5 team members',
      'Advanced automation & recovery',
      'bKash — 3 devices · 15,000 trx / month',
      'Custom pipeline stages & segmentation',
      'Advanced attribution & funnel analytics',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Pricing</Badge>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Simple pricing that grows with you
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Start free, upgrade when you’re ready. No credit card to begin.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem key={plan.name}>
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-4xl border p-8 transition-all duration-300',
                  plan.featured
                    ? 'border-electric/30 bg-navy text-white shadow-glow lg:-translate-y-3'
                    : 'border-navy/10 bg-white text-navy shadow-soft hover:-translate-y-1 hover:shadow-card'
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-glow">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                <p className={cn('mt-1 text-sm', plan.featured ? 'text-white/60' : 'text-navy/50')}>
                  {plan.tagline}
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className={cn('mb-1.5 text-sm', plan.featured ? 'text-white/55' : 'text-navy/45')}>
                    {plan.period}
                  </span>
                </div>

                <Button
                  href="/signup"
                  variant={plan.featured ? 'primary' : 'secondary'}
                  size="lg"
                  className={cn('mt-6 w-full', plan.featured && 'bg-electric hover:bg-azure')}
                >
                  {plan.cta}
                </Button>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckIcon
                        width={17}
                        height={17}
                        className={cn('mt-0.5 shrink-0', plan.featured ? 'text-azure' : 'text-electric')}
                      />
                      <span className={plan.featured ? 'text-white/80' : 'text-navy/70'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="mt-8 text-center text-sm text-navy/45">
          All plans include Bangla, Banglish &amp; English support. Prices in BDT (৳).
        </Reveal>
      </div>
    </section>
  )
}
