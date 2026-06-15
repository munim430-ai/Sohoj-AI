'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'
import { ChatIcon, CartIcon, ChartIcon, StoreIcon, WalletIcon } from '@/components/marketing/icons'

const tabs = [
  { id: 'inbox', label: 'Inbox', Icon: ChatIcon },
  { id: 'orders', label: 'Orders', Icon: CartIcon },
  { id: 'analytics', label: 'Analytics', Icon: ChartIcon },
] as const

type TabId = (typeof tabs)[number]['id']

export function ProductShowcase() {
  const [tab, setTab] = React.useState<TabId>('inbox')

  return (
    <section className="relative overflow-hidden bg-slate py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-electric/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>One clean dashboard</Badge>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Every chat, order &amp; taka in one place
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            A calm, modern workspace that turns Messenger chaos into organised sales.
          </p>
        </Reveal>

        {/* tabs */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-navy/10 bg-white p-1 shadow-soft">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5',
                  tab === id ? 'text-white' : 'text-navy/60 hover:text-navy'
                )}
              >
                {tab === id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-electric"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon width={16} height={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* browser frame */}
        <Reveal className="relative mt-10">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">
            {/* chrome */}
            <div className="flex items-center gap-2 border-b border-navy/5 bg-slate px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <div className="mx-auto hidden items-center gap-2 rounded-full bg-white px-4 py-1 text-xs text-navy/40 sm:flex">
                app.sohojai.com/dashboard
              </div>
            </div>

            {/* body */}
            <div className="flex min-h-[420px]">
              <DashSidebar active={tab} />
              <div className="flex-1 p-5 sm:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab === 'inbox' && <InboxView />}
                    {tab === 'orders' && <OrdersView />}
                    {tab === 'analytics' && <AnalyticsView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* floating accents */}
          <FloatingPaymentCard />
          <FloatingStatCard />
        </Reveal>
      </div>
    </section>
  )
}

function DashSidebar({ active }: { active: TabId }) {
  const items = [
    { id: 'inbox', Icon: ChatIcon },
    { id: 'orders', Icon: CartIcon },
    { id: 'analytics', Icon: ChartIcon },
    { id: 'products', Icon: StoreIcon },
    { id: 'bkash', Icon: WalletIcon },
  ]
  return (
    <div className="hidden w-16 flex-col items-center gap-1 border-r border-navy/5 bg-white py-5 sm:flex">
      <Image src="/logo-mark.png" alt="sohojAI" width={301} height={373} className="mb-4 h-7 w-auto" />
      {items.map(({ id, Icon }) => (
        <span
          key={id}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
            active === id ? 'bg-electric/10 text-electric' : 'text-navy/35'
          )}
        >
          <Icon width={20} height={20} />
        </span>
      ))}
    </div>
  )
}

function ViewHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
        <p className="text-xs text-navy/45">{sub}</p>
      </div>
      <span className="hidden rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 sm:inline">
        AI active
      </span>
    </div>
  )
}

function InboxView() {
  const chats = [
    { name: 'Rakib Hasan', msg: 'price koto? inbox plz', tag: 'New lead', tone: 'electric', time: '2m', bn: false },
    { name: 'Sumaiya Akter', msg: 'Dhakar baire delivery hobe?', tag: 'AI replied', tone: 'emerald', time: '6m', bn: true },
    { name: 'Tanvir Ahmed', msg: 'Order confirm korlam ✅', tag: 'Order', tone: 'navy', time: '11m', bn: true },
    { name: 'Nusrat Jahan', msg: 'cart e ekta item ache', tag: 'Recovery', tone: 'amber', time: '25m', bn: true },
  ]
  const toneMap: Record<string, string> = {
    electric: 'bg-electric/10 text-electric',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    navy: 'bg-navy/10 text-navy',
    amber: 'bg-amber-500/10 text-amber-600',
  }
  return (
    <div>
      <ViewHeader title="Inbox" sub="Mixed Bangla / English · auto-handled" />
      <div className="space-y-2.5">
        {chats.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-3 rounded-2xl border border-navy/5 bg-slate/60 px-3.5 py-3 transition-colors hover:bg-slate"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-electric/10 font-display text-xs font-bold text-electric">
              {c.name.split(' ').map((p) => p[0]).join('')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-navy">{c.name}</p>
              <p className={cn('truncate text-xs text-navy/55', c.bn && 'font-bangla')}>{c.msg}</p>
            </div>
            <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold', toneMap[c.tone])}>
              {c.tag}
            </span>
            <span className="hidden w-8 shrink-0 text-right text-[11px] text-navy/35 sm:block">{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersView() {
  const orders = [
    { id: '#1024', name: 'Tanvir Ahmed', item: 'Smartwatch Pro', amt: '৳1,260', status: 'Confirmed' },
    { id: '#1023', name: 'Sumaiya Akter', item: 'Wireless Earbuds', amt: '৳1,850', status: 'Confirmed' },
    { id: '#1022', name: 'Rakib Hasan', item: 'Power Bank 20k', amt: '৳1,400', status: 'Pending' },
    { id: '#1021', name: 'Nusrat Jahan', item: 'Smartwatch Lite', amt: '৳990', status: 'Pending' },
  ]
  return (
    <div>
      <ViewHeader title="Orders" sub="Drafted &amp; confirmed automatically" />
      <div className="overflow-hidden rounded-2xl border border-navy/5">
        <div className="hidden grid-cols-[1fr_1.4fr_1fr_0.9fr] bg-slate px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-navy/40 sm:grid">
          <span>Order</span>
          <span>Customer</span>
          <span>Amount</span>
          <span className="text-right">Status</span>
        </div>
        {orders.map((o) => (
          <div
            key={o.id}
            className="grid grid-cols-[1fr_1fr] items-center gap-2 border-t border-navy/5 px-4 py-3 first:border-t-0 sm:grid-cols-[1fr_1.4fr_1fr_0.9fr]"
          >
            <span className="font-display text-sm font-semibold text-navy">{o.id}</span>
            <div className="text-sm text-navy/70">
              {o.name}
              <span className="block text-xs text-navy/40">{o.item}</span>
            </div>
            <span className="font-display text-sm font-bold text-navy">{o.amt}</span>
            <span className="text-right">
              <span
                className={cn(
                  'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                  o.status === 'Confirmed'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-amber-500/10 text-amber-600'
                )}
              >
                {o.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsView() {
  const stats = [
    { label: 'Revenue (30d)', value: '৳1,84,200', delta: '+24%' },
    { label: 'Conversations', value: '1,432', delta: '+18%' },
    { label: 'Chat → Order', value: '38.5%', delta: '+6.2%' },
  ]
  const bars = [38, 52, 44, 66, 58, 80, 72]
  return (
    <div>
      <ViewHeader title="Analytics" sub="Revenue &amp; chat conversion" />
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-navy/5 bg-slate/60 p-3.5">
            <p className="text-[11px] text-navy/45">{s.label}</p>
            <p className="mt-1 font-display text-base font-bold text-navy sm:text-xl">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-navy/5 bg-white p-4">
        <div className="flex items-end justify-between gap-2 sm:gap-4" style={{ height: 150 }}>
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-lg bg-gradient-to-t from-electric to-azure"
                style={{ minHeight: 6 }}
              />
              <span className="text-[10px] text-navy/35">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FloatingPaymentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="absolute -bottom-6 -left-2 hidden w-56 animate-float rounded-2xl border border-navy/5 bg-white p-3.5 shadow-card lg:block"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2136E] text-white">
          <WalletIcon width={16} height={16} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-navy">৳1,260.00</p>
          <p className="text-[11px] text-navy/45">bKash · auto-matched</p>
        </div>
      </div>
    </motion.div>
  )
}

function FloatingStatCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="absolute -right-2 -top-6 hidden w-48 animate-float rounded-2xl border border-navy/5 bg-white p-3.5 shadow-card lg:block"
      style={{ animationDelay: '1.2s' }}
    >
      <p className="text-[11px] text-navy/45">Orders today</p>
      <p className="mt-1 font-display text-2xl font-bold text-navy">47</p>
      <p className="text-[11px] font-semibold text-emerald-600">+12 vs yesterday</p>
    </motion.div>
  )
}
