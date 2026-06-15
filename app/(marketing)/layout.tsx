import type { Metadata } from 'next'
import { Poppins, Inter, Hind_Siliguri } from 'next/font/google'
import { cn } from '@/lib/utils'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
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
        poppins.variable,
        inter.variable,
        hindSiliguri.variable,
        'min-h-screen bg-slate font-sans text-navy antialiased selection:bg-electric/15'
      )}
    >
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
