import Link from 'next/link'
import { Logo } from '@/components/marketing/logo'

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Login', href: '/login' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Refund Policy', href: '/refund' },
]

const socials = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'X', href: '#' },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-navy/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-8" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy/60">
              AI customer support for Bangladeshi Facebook &amp; F-commerce sellers.
              We talk. You sell.
            </p>
            <p className="mt-5 text-sm text-navy/60">
              <a
                href="mailto:munimm247@gmail.com"
                className="font-medium text-navy hover:text-electric"
              >
                munimm247@gmail.com
              </a>
              <br />
              Dhaka, Bangladesh
            </p>
          </div>

          <FooterCol title="Product" links={productLinks} />
          <FooterCol title="Legal" links={legalLinks} />
          <FooterCol title="Social" links={socials} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-navy/10 pt-6 text-sm text-navy/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} sohojAI. Operated by Keystone Consultancy.</p>
          <p>Built for Bangladeshi sellers 🇧🇩</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-navy">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-navy/60 transition-colors hover:text-electric"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
