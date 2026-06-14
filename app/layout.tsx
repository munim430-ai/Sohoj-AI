import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShahojAI - Customer Support Agent',
  description: 'AI-powered customer support for Bangladeshi e-commerce sellers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        {children}
      </body>
    </html>
  )
}
