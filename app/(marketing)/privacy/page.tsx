import type { Metadata } from 'next'
import { LegalPage } from '@/components/marketing/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — sohojAI',
  description: 'How sohojAI collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="15 June 2026"
      intro="This Privacy Policy explains how sohojAI (“we”, “us”) collects, uses, and protects information when you use our website and services. By using sohojAI, you agree to the practices described here."
      sections={[
        {
          heading: 'Information we collect',
          body: (
            <p>
              We collect account information you provide (such as name, email, and
              business details), data from connected platforms you authorise (such as
              Facebook Pages and Messenger conversations), product and order data you
              upload, and technical information such as device and usage data.
            </p>
          ),
        },
        {
          heading: 'How we use information',
          body: (
            <p>
              We use information to provide and improve the service, automate customer
              conversations on your behalf, generate analytics, process payments, provide
              support, and keep the platform secure. We do not sell your personal data.
            </p>
          ),
        },
        {
          heading: 'Messaging and platform data',
          body: (
            <p>
              When you connect a Facebook Page or Messenger account, we process messages
              and comments solely to deliver the features you enable, in accordance with
              the terms of those platforms. You can disconnect any integration at any
              time.
            </p>
          ),
        },
        {
          heading: 'Payment information',
          body: (
            <p>
              Payments are handled by third-party payment providers. We store limited
              transaction metadata (such as amount, reference, and status) to match
              payments to orders. We do not store full financial credentials.
            </p>
          ),
        },
        {
          heading: 'Data sharing',
          body: (
            <p>
              We share data only with service providers who help us operate the platform
              (for example, hosting and infrastructure partners), when required by law, or
              with your consent.
            </p>
          ),
        },
        {
          heading: 'Data retention',
          body: (
            <p>
              We retain data according to your plan’s conversation-history limits and as
              needed to provide the service and comply with legal obligations. You may
              request deletion of your account data, subject to applicable law.
            </p>
          ),
        },
        {
          heading: 'Your rights',
          body: (
            <p>
              You may access, correct, export, or request deletion of your personal data
              by contacting us. We will respond within a reasonable time frame.
            </p>
          ),
        },
        {
          heading: 'Changes to this policy',
          body: (
            <p>
              We may update this policy from time to time. Material changes will be
              communicated through the service or by email.
            </p>
          ),
        },
      ]}
    />
  )
}
