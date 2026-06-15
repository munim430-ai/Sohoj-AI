import { Reveal, RevealStagger, RevealItem } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'
import { ChatIcon, SparkleIcon, ChartIcon } from '@/components/marketing/icons'

const steps = [
  {
    Icon: ChatIcon,
    step: '01',
    title: 'Connect your Page',
    body: 'Link your Facebook Page and Messenger in a couple of clicks. Import your products from Google Sheets and you’re ready.',
  },
  {
    Icon: SparkleIcon,
    step: '02',
    title: 'AI handles every chat',
    body: 'Comments and inbox messages get instant Bangla/Banglish replies — answering prices, delivery, and confirming orders 24/7.',
  },
  {
    Icon: ChartIcon,
    step: '03',
    title: 'Orders & bKash, tracked',
    body: 'Confirmed orders and matched bKash payments land in one clean dashboard, with revenue and conversion analytics built in.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>How it works</Badge>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Live in minutes, not weeks
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Three simple steps from setup to your first AI-handled sale.
          </p>
        </Reveal>

        <RevealStagger className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-electric/25 to-transparent md:block" />

          {steps.map(({ Icon, step, title, body }) => (
            <RevealItem key={step}>
              <div className="relative text-center md:text-left">
                <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-electric/15 bg-slate shadow-soft md:mx-0">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-electric text-white">
                    <Icon width={26} height={26} />
                  </span>
                </div>
                <p className="mt-5 font-display text-sm font-bold tracking-widest text-electric/70">
                  {step}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-navy">
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
