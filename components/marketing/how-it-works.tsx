'use client'

import { motion } from 'framer-motion'
import { Link2, Sparkles, BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ChatDemo } from '@/components/marketing/chat-demo'

const steps = [
  {
    Icon: Link2,
    step: '01',
    title: 'Connect your Page',
    body: 'Link your Facebook Page and Messenger in a couple of clicks. Import your products from Google Sheets and you’re ready.',
  },
  {
    Icon: Sparkles,
    step: '02',
    title: 'AI handles every chat',
    body: 'Comments and inbox messages get instant Bangla/Banglish replies — answering prices, delivery, and confirming orders 24/7.',
  },
  {
    Icon: BarChart3,
    step: '03',
    title: 'Orders & bKash, tracked',
    body: 'Confirmed orders and matched bKash payments land in one clean dashboard, with revenue and conversion analytics built in.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-border bg-secondary/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <Badge>How it works</Badge>
          <h2 className="mt-5 max-w-md font-display text-4xl leading-[1] tracking-tight text-foreground sm:text-5xl">
            Live in minutes, not <em className="italic">weeks</em>
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Three simple steps from setup to your first AI-handled sale.
          </p>

          <div className="mt-10 space-y-8">
            {steps.map(({ Icon, step, title, body }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-lg tracking-widest text-muted-foreground">{step}</p>
                  <h3 className="font-display text-2xl tracking-tight text-foreground">{title}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <ChatDemo />
        </motion.div>
      </div>
    </section>
  )
}
