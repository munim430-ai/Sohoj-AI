import type { Metadata } from 'next'
import { LegalPage } from '@/components/marketing/legal-page'

export const metadata: Metadata = {
  title: 'Terms & Conditions — sohojAI',
  description: 'The terms governing your use of sohojAI.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="15 June 2026"
      intro="These Terms & Conditions govern your access to and use of sohojAI. By creating an account or using the service, you agree to these terms."
      sections={[
        {
          heading: 'Eligibility and account',
          body: (
            <p>
              You must be able to form a binding contract and operate a legitimate
              business to use sohojAI. You are responsible for the activity under your
              account and for keeping your credentials secure.
            </p>
          ),
        },
        {
          heading: 'Use of the service',
          body: (
            <p>
              You agree to use sohojAI lawfully and in line with the policies of any
              connected platforms (such as Facebook and Messenger). You may not use the
              service for spam, fraud, harassment, or any prohibited content.
            </p>
          ),
        },
        {
          heading: 'AI-generated responses',
          body: (
            <p>
              sohojAI automates conversations on your behalf. While we work to keep
              responses accurate and helpful, you remain responsible for the messages sent
              from your connected accounts and for fulfilling orders and obligations to
              your customers.
            </p>
          ),
        },
        {
          heading: 'Plans, billing, and limits',
          body: (
            <p>
              Paid plans are billed in advance on a monthly basis in BDT (৳). Plan limits
              are enforced per organisation and billing period. You can upgrade or
              downgrade at any time; downgrades take effect according to your billing
              cycle.
            </p>
          ),
        },
        {
          heading: 'Acceptable use',
          body: (
            <p>
              We may suspend or terminate accounts that violate these terms, abuse the
              service, or create risk for sohojAI or other users.
            </p>
          ),
        },
        {
          heading: 'Intellectual property',
          body: (
            <p>
              sohojAI and its software, branding, and content are owned by us or our
              licensors. You retain ownership of your business data and content.
            </p>
          ),
        },
        {
          heading: 'Disclaimers and liability',
          body: (
            <p>
              The service is provided “as is”. To the maximum extent permitted by law, we
              are not liable for indirect or consequential damages, or for losses arising
              from third-party platforms outside our control.
            </p>
          ),
        },
        {
          heading: 'Changes and governing law',
          body: (
            <p>
              We may update these terms from time to time. These terms are governed by the
              laws of Bangladesh, without regard to conflict-of-law principles.
            </p>
          ),
        },
      ]}
    />
  )
}
