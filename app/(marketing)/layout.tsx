import type { Metadata } from 'next'
import { Instrument_Serif, Inter, Hind_Siliguri } from 'next/font/google'
import { cn } from '@/lib/utils'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hind',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'sohojAI — We talk. You sell.',
  description:
    'AI customer support for Bangladeshi Facebook & F-commerce sellers. Comment-to-Order automation, Abandoned Inbox Recovery, and bKash money tracking — in Bangla, Banglish, and English.',
  metadataBase: new URL('https://sohojai.com'),
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'sohojAI — We talk. You sell.',
    description:
      'Never miss another late-night order. Let intelligent AI handle your customer chats while you scale your business.',
    type: 'website',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        instrumentSerif.variable,
        inter.variable,
        hindSiliguri.variable,
        'min-h-screen bg-background font-body text-foreground antialiased selection:bg-accent/15'
      )}
    >
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
