import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Home,
  Inbox,
  ShoppingCart,
  Wallet,
  Package,
  BarChart3,
  Users,
  Workflow,
  RotateCcw,
  Settings,
  Check,
} from 'lucide-react'

/**
 * Coded sohojAI seller dashboard shown floating in the hero (not an image).
 * Static and non-interactive on purpose: select-none pointer-events-none.
 */
export function DashboardPreview() {
  return (
    <div
      className="select-none rounded-2xl p-3 md:p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: 'var(--shadow-dashboard)',
      }}
    >
      <div className="pointer-events-none overflow-hidden rounded-xl border border-border bg-background text-[11px]">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground">
              S
            </span>
            <span className="font-semibold text-foreground">sohojAI</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary/60 px-2 py-1 text-muted-foreground sm:flex">
            <Search className="h-3 w-3" />
            <span>Search orders, chats…</span>
            <span className="ml-6 rounded border border-border bg-background px-1 text-[9px]">⌘K</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-accent-foreground">
              New order
            </span>
            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-foreground">
              RH
            </span>
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="hidden w-40 shrink-0 flex-col gap-0.5 border-r border-border p-2 sm:flex">
            <NavItem icon={Home} label="Home" active />
            <NavItem icon={Inbox} label="Inbox" badge="12" />
            <NavItem icon={ShoppingCart} label="Orders" />
            <NavItem icon={Wallet} label="Payments" chevron />
            <NavItem icon={Package} label="Products" />
            <NavItem icon={BarChart3} label="Analytics" />
            <NavItem icon={Users} label="Customers" chevron />
            <p className="px-2 pb-1 pt-3 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
              Workflows
            </p>
            <NavItem icon={Workflow} label="Automations" />
            <NavItem icon={RotateCcw} label="Recovery" />
            <NavItem icon={Bell} label="Notifications" />
            <NavItem icon={Settings} label="Settings" />
          </aside>

          {/* main */}
          <main className="min-w-0 flex-1 bg-secondary/30 p-3">
            <p className="text-sm font-semibold text-foreground">Welcome back, Rahim</p>

            {/* action pills */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Pill className="bg-accent text-accent-foreground">Reply</Pill>
              <Pill>Confirm</Pill>
              <Pill>Refund</Pill>
              <Pill>Export</Pill>
              <Pill>Create Order</Pill>
              <span className="text-[10px] text-muted-foreground">+ Customize</span>
            </div>

            {/* cards */}
            <div className="mt-3 flex flex-col gap-2 md:flex-row">
              {/* revenue */}
              <div className="flex-1 basis-0 rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Revenue (30d)</span>
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  ৳1,84,200
                  <span className="text-xs text-muted-foreground">.00</span>
                </p>
                <div className="mt-1 flex items-center gap-3 text-[10px]">
                  <span className="text-muted-foreground">Last 30 Days</span>
                  <span className="font-medium text-emerald-600">+৳1.8L</span>
                  <span className="font-medium text-rose-500">−৳9K</span>
                </div>
                <RevenueChart />
              </div>

              {/* bKash */}
              <div className="flex-1 basis-0 rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>bKash</span>
                  <div className="flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    <MoreHorizontal className="h-3 w-3" />
                  </div>
                </div>
                <Row label="Cash In" value="৳1,84,200.00" />
                <Row label="Merchant Payments" value="৳1,62,540.00" />
                <Row label="Balance" value="৳15,200.00" />
              </div>
            </div>

            {/* recent orders */}
            <div className="mt-3">
              <p className="mb-1.5 font-semibold text-foreground">Recent Orders</p>
              <div className="rounded-lg border border-border bg-background">
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 border-b border-border px-3 py-1.5 text-[10px] text-muted-foreground">
                  <span>Date</span>
                  <span>Customer</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">Status</span>
                </div>
                <OrderRow date="Jun 15" who="Rakib — Smartwatch" amt="+৳1,260" status="Confirmed" />
                <OrderRow date="Jun 15" who="Sumaiya — Earbuds" amt="+৳1,850" status="Confirmed" />
                <OrderRow date="Jun 14" who="Tanvir — Power Bank" amt="৳1,400" status="Pending" />
                <OrderRow date="Jun 14" who="Nusrat — Smartwatch" amt="৳990" status="Pending" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
  chevron,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  badge?: string
  chevron?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
        active ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded bg-accent/15 px-1 text-[9px] font-medium text-accent">{badge}</span>
      )}
      {chevron && <ChevronRight className="h-3 w-3" />}
    </div>
  )
}

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-foreground ${className}`}
    >
      {children}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function OrderRow({
  date,
  who,
  amt,
  status,
}: {
  date: string
  who: string
  amt: string
  status: 'Confirmed' | 'Pending'
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-border px-3 py-2 text-[11px] last:border-b-0">
      <span className="text-muted-foreground">{date}</span>
      <span className="truncate font-bangla text-foreground">{who}</span>
      <span className="text-right font-medium text-foreground">{amt}</span>
      <span
        className={`justify-self-end rounded-full px-2 py-0.5 text-[9px] font-medium ${
          status === 'Confirmed'
            ? 'bg-emerald-500/10 text-emerald-600'
            : 'bg-amber-500/10 text-amber-600'
        }`}
      >
        {status}
      </span>
    </div>
  )
}

function RevenueChart() {
  return (
    <svg viewBox="0 0 240 80" className="mt-2 h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,60 C30,58 40,40 70,42 C100,44 110,20 140,24 C170,28 185,12 210,14 C225,15 235,10 240,8"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M0,60 C30,58 40,40 70,42 C100,44 110,20 140,24 C170,28 185,12 210,14 C225,15 235,10 240,8 L240,80 L0,80 Z"
        fill="url(#rev-fill)"
      />
    </svg>
  )
}
