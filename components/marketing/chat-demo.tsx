'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BkashMark, MessengerMark } from '@/components/marketing/icons'

type Item =
  | { kind: 'msg'; side: 'in' | 'out'; text: string; bangla?: boolean; readMs: number; typeMs?: number }
  | { kind: 'order'; readMs: number }
  | { kind: 'payment'; readMs: number; typeMs?: number }

const SEQUENCE: Item[] = [
  { kind: 'msg', side: 'in', text: 'price koto? inbox plz 😍', readMs: 1100 },
  {
    kind: 'msg',
    side: 'out',
    bangla: true,
    text: 'Assalamu Alaikum! Inbox-e detail pathano hoyeche. Please check your message request. ✅',
    typeMs: 1300,
    readMs: 1500,
  },
  { kind: 'msg', side: 'in', bangla: true, text: 'Delivery charge koto Dhaka te?', readMs: 1100 },
  {
    kind: 'msg',
    side: 'out',
    bangla: true,
    text: 'Dhakar vitore ৳60, baire ৳120. Order confirm korte apnar phone number r address din. 📦',
    typeMs: 1400,
    readMs: 1600,
  },
  { kind: 'msg', side: 'in', bangla: true, text: 'Nilam — Dhanmondi 27. 0171XXXXXXX', readMs: 1200 },
  { kind: 'order', readMs: 1700 },
  { kind: 'payment', typeMs: 900, readMs: 2600 },
]

export function ChatDemo({ className }: { className?: string }) {
  const [count, setCount] = React.useState(0)
  const [typing, setTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    let i = 0

    const wait = (ms: number) => new Promise<void>((r) => (timer = setTimeout(r, ms)))

    const run = async () => {
      while (alive) {
        if (i >= SEQUENCE.length) {
          await wait(2600)
          if (!alive) return
          setCount(0)
          i = 0
          await wait(500)
          continue
        }
        const item = SEQUENCE[i]
        const typeMs = (item as { typeMs?: number }).typeMs
        const isOutgoing = item.kind === 'order' || item.kind === 'payment' || item.side === 'out'
        if (isOutgoing && typeMs) {
          setTyping(true)
          await wait(typeMs)
          if (!alive) return
          setTyping(false)
        }
        setCount(i + 1)
        i += 1
        await wait(item.readMs)
      }
    }
    run()
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(id)
  }, [count, typing])

  const items = SEQUENCE.slice(0, count)

  return (
    <div className={cn('relative mx-auto w-full max-w-[320px]', className)}>
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-accent/10 blur-3xl" />

      <div className="rounded-[2.6rem] border border-border bg-foreground p-2.5 shadow-dashboard">
        <div className="overflow-hidden rounded-[2.1rem] bg-secondary">
          {/* header */}
          <div className="flex items-center gap-3 bg-background px-4 py-3.5">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MessengerMark width={18} height={18} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Your Store</p>
              <p className="text-[11px] text-emerald-600">● Active now · AI is replying</p>
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="h-[360px] space-y-2.5 overflow-hidden px-3.5 py-4">
            <AnimatePresence initial={false}>
              {items.map((item, idx) => (
                <Bubble key={idx} item={item} />
              ))}
              {typing && <TypingBubble key="typing" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bubble({ item }: { item: Item }) {
  if (item.kind === 'order') return <OrderCard />
  if (item.kind === 'payment') return <PaymentCard />

  const incoming = item.side === 'in'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex', incoming ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug shadow-sm',
          item.bangla && 'font-bangla',
          incoming
            ? 'rounded-bl-md bg-background text-foreground'
            : 'rounded-br-md bg-accent text-accent-foreground'
        )}
      >
        {item.text}
      </div>
    </motion.div>
  )
}

function TypingBubble() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-end"
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-br-md bg-accent/90 px-3.5 py-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-accent-foreground"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function OrderCard() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-end"
    >
      <div className="w-[88%] rounded-2xl rounded-br-md border border-emerald-200 bg-background p-3.5 shadow-dashboard">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-foreground">Order #1024</p>
            <p className="text-[11px] font-medium text-emerald-600">Confirmed</p>
          </div>
          <p className="ml-auto text-base font-bold text-foreground">৳1,260</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
          <span>📍 Dhanmondi 27, Dhaka</span>
          <span className="text-right">🚚 Delivery ৳60</span>
        </div>
      </div>
    </motion.div>
  )
}

function PaymentCard() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-start"
    >
      <div className="w-[90%] overflow-hidden rounded-2xl rounded-bl-md bg-background shadow-dashboard">
        <div className="flex items-center gap-2 bg-[#E2136E] px-3.5 py-2 text-white">
          <BkashMark width={15} height={15} />
          <p className="text-[12px] font-semibold">bKash payment received</p>
        </div>
        <div className="px-3.5 py-3">
          <p className="text-lg font-bold text-foreground">৳1,260.00</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            From 0171XXXXXXX · Ref. Order1024
            <br />
            TrxID 9A8B7C6D2E · auto-matched ✅
          </p>
        </div>
      </div>
    </motion.div>
  )
}
