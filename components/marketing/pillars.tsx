import { Reveal, RevealStagger, RevealItem } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'
import {
  CartIcon,
  RecoveryIcon,
  WalletIcon,
  StoreIcon,
} from '@/components/marketing/icons'

const pillars = [
  {
    Icon: CartIcon,
    title: 'Comment-to-Order automation',
    body: 'Turn “price koto?” and “inbox plz” comments into confirmed orders automatically — replies in the inbox, collects details, drafts the order.',
    tint: 'bg-electric/10 text-electric',
  },
  {
    Icon: RecoveryIcon,
    title: 'Abandoned Inbox Recovery',
    body: 'Customers who went quiet get a gentle, perfectly-timed nudge — recover lost carts with friendly Banglish follow-ups that actually convert.',
    tint: 'bg-azure/15 text-azure',
  },
  {
    Icon: WalletIcon,
    title: 'bKash money tracking',
    body: 'Every Cash In, Send Money, and Merchant Payment auto-matched to the right order. Daily, weekly, and monthly summaries with zero manual entry.',
    tint: 'bg-[#E2136E]/10 text-[#E2136E]',
  },
  {
    Icon: StoreIcon,
    title: 'Built for Bangladeshi sellers',
    body: 'Native Bangla, Banglish, and English. Made for Facebook & F-commerce — the way you actually sell on Page comments and Messenger.',
    tint: 'bg-emerald-500/10 text-emerald-600',
  },
]

export function Pillars() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Why sohojAI</Badge>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Everything you need to sell while you sleep
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Four pillars that quietly run your storefront — so no message, order, or
            payment ever slips through.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2">
          {pillars.map(({ Icon, title, body, tint }) => (
            <RevealItem key={title}>
              <div className="group h-full rounded-4xl border border-navy/5 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tint}`}
                >
                  <Icon width={26} height={26} />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-3 leading-relaxed text-navy/60">{body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
