'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatDemo } from '@/components/marketing/chat-demo'
import { ArrowRightIcon, PlayIcon, SparkleIcon, CheckIcon } from '@/components/marketing/icons'

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36">
      {/* decorative brand blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-azure/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-electric/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy/5 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
        {/* copy */}
        <div className="text-center lg:text-left">
          <motion.div custom={0} variants={fade} initial="hidden" animate="show" className="flex justify-center lg:justify-start">
            <Badge>
              <SparkleIcon width={14} height={14} />
              Built for Bangladeshi F-commerce
            </Badge>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl lg:text-7xl"
          >
            We talk.
            <br />
            <span className="bg-gradient-to-r from-electric to-azure bg-clip-text text-transparent">
              You sell.
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-navy/65 lg:mx-0"
          >
            Never miss another late-night order. Let intelligent AI handle your
            customer chats while you scale your business.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button href="/signup" variant="primary" size="lg" className="w-full sm:w-auto">
              Start Free
              <ArrowRightIcon width={18} height={18} />
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg" className="w-full sm:w-auto">
              <PlayIcon width={16} height={16} />
              See it work
            </Button>
          </motion.div>

          <motion.ul
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-navy/55 lg:justify-start"
          >
            {['No credit card needed', 'Bangla · Banglish · English', 'Live in minutes'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckIcon width={15} height={15} className="text-electric" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* animated demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <ChatDemo />
        </motion.div>
      </div>
    </section>
  )
}
