import type { Metadata } from 'next'
import { LegalPage } from '@/components/marketing/legal-page'

export const metadata: Metadata = {
  title: 'Refund Policy — sohojAI',
  description: 'sohojAI subscription refund and cancellation policy.',
}

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="15 June 2026"
      intro="This Refund Policy explains how cancellations and refunds work for sohojAI subscriptions."
      sections={[
        {
          heading: 'Free plan',
          body: (
            <p>
              The Free plan lets you try sohojAI at no cost, so you can evaluate the
              product before subscribing to a paid plan. No payment is required.
            </p>
          ),
        },
        {
          heading: 'Subscription billing',
          body: (
            <p>
              Paid plans (Basic and Pro) are billed monthly in advance in BDT (৳). Your
              subscription renews automatically each billing period until cancelled.
            </p>
          ),
        },
        {
          heading: 'Cancellations',
          body: (
            <p>
              You may cancel at any time from your billing settings. Cancellation stops
              future renewals; your plan remains active until the end of the current
              billing period, after which access reverts to the Free plan.
            </p>
          ),
        },
        {
          heading: 'Refund eligibility',
          body: (
            <p>
              Monthly subscription fees are generally non-refundable for partial periods.
              If you believe you were charged in error, or experienced a significant
              service failure, contact us within 7 days of the charge and we will review
              your request in good faith.
            </p>
          ),
        },
        {
          heading: 'How refunds are processed',
          body: (
            <p>
              Approved refunds are issued to the original payment method where possible.
              Processing times depend on your payment provider.
            </p>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <p>
              For any billing or refund question, email{' '}
              <a href="mailto:munimm247@gmail.com" className="font-medium text-electric">
                munimm247@gmail.com
              </a>{' '}
              with your account details and we’ll help.
            </p>
          ),
        },
      ]}
    />
  )
}
