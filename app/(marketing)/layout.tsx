import type { Metadata } from 'next'
import '@/styles/uber-design.css'
import '@/styles/marketing.css'
import { Nav } from './_components/Nav'
import { Footer } from './_components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://shahojai.com'),
  title: {
    default: 'ShahojAI — AI customer support that speaks your customers’ language',
    template: '%s · ShahojAI',
  },
  description:
    'ShahojAI gives Bangladeshi e-commerce sellers an AI support agent that answers in Bangla and English from your own FAQs. Embeddable widget, white-label, aamarPay billing.',
  keywords: [
    'AI customer support',
    'Bangladesh ecommerce',
    'Bangla chatbot',
    'support automation',
    'RAG chatbot',
    'white-label chat widget',
  ],
  openGraph: {
    title: 'ShahojAI — AI customer support that speaks your customers’ language',
    description:
      'Answer 90% of repeat questions automatically — in Bangla and English. Built for Bangladeshi e-commerce.',
    url: 'https://shahojai.com',
    siteName: 'ShahojAI',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'ShahojAI' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShahojAI — AI customer support in Bangla & English',
    description: 'Answer 90% of repeat questions automatically. Built for Bangladeshi e-commerce.',
    images: ['/og-image.svg'],
  },
  manifest: '/manifest.json',
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mk-root">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
