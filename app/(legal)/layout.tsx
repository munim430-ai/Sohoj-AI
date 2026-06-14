import type { Metadata } from 'next'
import Link from 'next/link'
import '../../styles/uber-design.css'

export const metadata: Metadata = {
  title: 'Legal | ShahojAI',
  description: 'Legal, privacy, and governance documents for ShahojAI.',
}

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#000000',
        fontFamily: fontStack,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <header
        style={{
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'saturate(180%) blur(8px)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 700,
              fontSize: 20,
              color: '#000000',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            ShahojAI
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#757575',
              textDecoration: 'none',
            }}
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '40px 24px 96px',
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: '#757575',
            margin: '0 0 32px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}
        >
          Last updated: June 2026
        </p>
        <article className="legal-prose">{children}</article>
      </main>

      <footer
        style={{
          borderTop: '1px solid #e0e0e0',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 13,
          }}
        >
          {[
            ['Privacy', '/privacy'],
            ['Terms', '/terms'],
            ['Cookies', '/cookies'],
            ['Acceptable Use', '/acceptable-use'],
            ['Refunds', '/refunds'],
            ['DPA', '/dpa'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{ color: '#757575', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </div>
        <p
          style={{
            maxWidth: 720,
            margin: '16px auto 0',
            fontSize: 12,
            color: '#9e9e9e',
          }}
        >
          ShahojAI Technologies Ltd. · Dhaka, Bangladesh
        </p>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .legal-prose { color: #1a1a1a; line-height: 1.7; }
            .legal-prose h1 {
              font-size: 34px; font-weight: 700; line-height: 1.15;
              letter-spacing: -0.02em; margin: 0 0 8px; color: #000;
            }
            .legal-prose .effective {
              font-size: 14px; color: #757575; margin: 0 0 40px;
            }
            .legal-prose h2 {
              font-size: 22px; font-weight: 700; letter-spacing: -0.01em;
              margin: 48px 0 12px; color: #000; scroll-margin-top: 80px;
            }
            .legal-prose h3 {
              font-size: 17px; font-weight: 600; margin: 28px 0 8px; color: #000;
            }
            .legal-prose p { font-size: 16px; line-height: 1.7; color: #2d2d2d; margin: 0 0 16px; }
            .legal-prose ul, .legal-prose ol { margin: 0 0 16px; padding-left: 24px; }
            .legal-prose li { font-size: 16px; line-height: 1.7; color: #2d2d2d; margin: 0 0 8px; }
            .legal-prose a { color: #1a73e8; text-decoration: underline; }
            .legal-prose strong { color: #000; font-weight: 600; }
            .legal-prose hr { border: none; border-top: 1px solid #e0e0e0; margin: 40px 0; }
            .legal-prose table {
              width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 15px;
              display: block; overflow-x: auto;
            }
            .legal-prose th, .legal-prose td {
              border: 1px solid #e0e0e0; padding: 10px 12px; text-align: left; vertical-align: top;
            }
            .legal-prose th { background: #f5f5f5; font-weight: 600; color: #000; }
            .legal-prose code {
              background: #f5f5f5; padding: 2px 6px; border-radius: 4px;
              font-size: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            }
            .legal-prose .lead { font-size: 18px; color: #2d2d2d; margin-bottom: 24px; }
            @media (max-width: 768px) {
              .legal-prose h1 { font-size: 28px; }
              .legal-prose h2 { font-size: 20px; }
            }
          `,
        }}
      />
    </div>
  )
}
