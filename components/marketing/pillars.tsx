import { ShoppingCart, RotateCcw, Wallet, Store } from 'lucide-react'
import { Reveal, RevealStagger, RevealItem } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'

const pillars = [
  {
    Icon: ShoppingCart,
    title: 'Comment-to-Order automation',
    body: 'Turn “price koto?” and “inbox plz” comments into confirmed orders automatically — replies in the inbox, collects details, drafts the order.',
  },
  {
    Icon: RotateCcw,
    title: 'Abandoned Inbox Recovery',
    body: 'Customers who went quiet get a gentle, perfectly-timed nudge — recover lost carts with friendly Banglish follow-ups that actually convert.',
  },
  {
    Icon: Wallet,
    title: 'bKash money tracking',
    body: 'Every Cash In, Send Money, and Merchant Payment auto-matched to the right order. Daily, weekly, and monthly summaries with zero manual entry.',
  },
  {
    Icon: Store,
    title: 'Built for Bangladeshi sellers',
    body: 'Native Bangla, Banglish, and English. Made for Facebook & F-commerce — the way you actually sell on Page comments and Messenger.',
  },
]

export function Pillars() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Why sohojAI</Badge>
          <h2 className="mt-5 font-display text-4xl leading-[1] tracking-tight text-foreground sm:text-5xl">
            Everything you need to sell while you <em className="italic">sleep</em>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four pillars that quietly run your storefront — so no message, order, or payment ever
            slips through.
          </p>
        </Reveal>

        <RevealStagger className="mt-16 grid gap-6 sm:grid-cols-2">
          {pillars.map(({ Icon, title, body }) => (
            <RevealItem key={title}>
              <div className="group h-full rounded-2xl border border-border bg-background p-8 transition-shadow duration-300 hover:shadow-dashboard">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
