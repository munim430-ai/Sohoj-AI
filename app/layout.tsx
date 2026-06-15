import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'sohojAI — We talk. You sell.',
  description: 'AI customer support for Bangladeshi Facebook & F-commerce sellers',
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
