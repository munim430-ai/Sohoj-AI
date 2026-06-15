'use client'

import { motion } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { DashboardPreview } from '@/components/marketing/dashboard-preview'

const fade = (delay: number, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 pt-28 md:pt-32">
      {/* background video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
      />
      {/* readability scrim — light enough to keep the video clearly visible */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-background/20 to-background/45" />
      <div className="absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-background to-transparent" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <motion.div {...fade(0, 10)}>
          <Badge>Built for Bangladeshi F-commerce ✨</Badge>
        </motion.div>

        <motion.h1
          {...fade(0.1)}
          className="mt-6 max-w-xl text-center font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-[5rem]"
        >
          We talk. You <em className="italic">sell.</em>
        </motion.h1>

        <motion.p
          {...fade(0.2)}
          className="mt-4 max-w-[650px] text-center text-base leading-relaxed text-foreground/80 md:text-lg"
        >
          Never miss another late-night order. Let intelligent AI handle your customer chats
          while you scale your business.
        </motion.p>

        <motion.div {...fade(0.3)} className="mt-5 flex items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            aria-label="See it work"
            className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-background shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors hover:bg-background/80"
          >
            <Play className="h-4 w-4 fill-foreground text-foreground" />
          </button>
        </motion.div>

        <motion.div {...fade(0.5, 30)} className="mt-8 w-full max-w-5xl">
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  )
}
