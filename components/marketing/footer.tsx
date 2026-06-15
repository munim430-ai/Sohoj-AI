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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-8" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI customer support for Bangladeshi Facebook &amp; F-commerce sellers. We talk. You sell.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              <a
                href="mailto:munimm247@gmail.com"
                className="font-medium text-foreground hover:text-accent"
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

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
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
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
