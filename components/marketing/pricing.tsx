import { Check } from 'lucide-react'
import { Reveal, RevealStagger, RevealItem } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: '৳0',
    period: 'forever',
    tagline: 'Prove the value, risk-free.',
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
    <section id="pricing" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Pricing</Badge>
          <h2 className="mt-5 font-display text-4xl leading-[1] tracking-tight text-foreground sm:text-5xl">
            Simple pricing that grows with <em className="italic">you</em>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you’re ready. No credit card to begin.
          </p>
        </Reveal>

        <RevealStagger className="mt-16 grid items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem key={plan.name}>
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border p-8 transition-shadow duration-300',
                  plan.featured
                    ? 'border-foreground bg-foreground text-background shadow-dashboard lg:-translate-y-3'
                    : 'border-border bg-background text-foreground hover:shadow-dashboard'
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-medium text-accent-foreground">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-2xl tracking-tight">{plan.name}</h3>
                <p
                  className={cn(
                    'mt-1 text-sm',
                    plan.featured ? 'text-background/60' : 'text-muted-foreground'
                  )}
                >
                  {plan.tagline}
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-5xl tracking-tight">{plan.price}</span>
                  <span
                    className={cn(
                      'mb-2 text-sm',
                      plan.featured ? 'text-background/55' : 'text-muted-foreground'
                    )}
                  >
                    {plan.period}
                  </span>
                </div>

                <a
                  href="/signup"
                  className={cn(
                    'mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors',
                    plan.featured
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  Start Free
                </a>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          plan.featured ? 'text-accent' : 'text-foreground'
                        )}
                      />
                      <span className={plan.featured ? 'text-background/80' : 'text-muted-foreground'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="mt-8 text-center text-sm text-muted-foreground">
          All plans include Bangla, Banglish &amp; English support. Prices in BDT (৳).
        </Reveal>
      </div>
    </section>
  )
}
