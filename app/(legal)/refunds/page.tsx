import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | ShahojAI',
  description:
    'When and how refunds are available for ShahojAI subscriptions and credit packs, in BDT via aamarPay.',
}

export default function RefundPolicyPage() {
  return (
    <>
      <h1>Refund Policy</h1>
      <p className="effective">Effective date: 14 June 2026</p>

      <p className="lead">
        This Refund Policy explains when and how refunds are available for
        purchases made on the ShahojAI platform (the &ldquo;Service&rdquo;),
        operated by ShahojAI Technologies Ltd. (&ldquo;ShahojAI&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). It forms part
        of, and should be read together with, our{' '}
        <Link href="/terms">Terms of Service</Link>. All amounts are stated and
        refunded in Bangladeshi Taka (BDT, &#2547;), and payments and refunds are
        processed through aamarPay.
      </p>

      <h2>1. Summary</h2>
      <ul>
        <li>
          <strong>Consumed credits are non-refundable.</strong> Once a credit has
          been used to perform an action (such as generating an AI response), it
          cannot be refunded.
        </li>
        <li>
          <strong>Unused credit packs</strong> may be refunded within a{' '}
          <strong>7-day cooling-off period</strong> from purchase, provided they
          have not been consumed.
        </li>
        <li>
          <strong>Subscription fees</strong> are generally non-refundable once a
          billing period has begun, except as required by law or as expressly
          stated below.
        </li>
      </ul>

      <h2>2. Credits</h2>
      <p>
        The Service is metered using credits. Credits are consumed as you use AI
        features such as generating responses and creating embeddings.
      </p>
      <ul>
        <li>
          <strong>Consumed credits are non-refundable.</strong> Because each
          metered action incurs real-time processing and third-party
          model-inference costs at the moment it is performed, credits that have
          been consumed are non-refundable under any circumstances, including
          account cancellation or downgrade.
        </li>
        <li>
          <strong>Monthly allocation credits</strong> included with your
          subscription tier have no cash value, do not roll over between billing
          periods, and are not refundable.
        </li>
      </ul>

      <h2>3. Pay-as-you-go credit packs &mdash; 7-day cooling-off period</h2>
      <p>
        If you purchase a one-time, pay-as-you-go credit pack, you may request a
        full refund of that pack within <strong>7 calendar days</strong> of the
        purchase date, provided that{' '}
        <strong>none of the credits in that pack have been consumed</strong>.
      </p>
      <ul>
        <li>
          If any credit from a pack has been used, the pack is considered consumed
          and is <strong>not eligible</strong> for a refund, even within the
          7-day window.
        </li>
        <li>Refunds are issued to the original payment method through aamarPay.</li>
        <li>
          The 7-day cooling-off period applies per purchase and begins on the date
          the purchase is completed.
        </li>
      </ul>

      <h2>4. Subscriptions</h2>
      <p>
        Subscriptions (Starter, Pro, and Enterprise tiers) are billed in advance
        for each billing period.
      </p>
      <ul>
        <li>
          Subscription fees for the current billing period are{' '}
          <strong>non-refundable</strong> once the period has begun, except where
          required by applicable law.
        </li>
        <li>
          You may cancel your subscription at any time; cancellation takes effect
          at the end of the current billing period, and you retain access until
          then. We do not provide pro-rated refunds for partial periods.
        </li>
        <li>
          If you upgrade mid-period, the new tier applies immediately and is
          charged on a pro-rated basis; downgrades take effect at the next
          renewal.
        </li>
        <li>
          Enterprise subscriptions governed by a separate order form follow the
          refund and cancellation terms in that order form, which prevail over
          this Policy to the extent of any conflict.
        </li>
      </ul>

      <h2>5. Exceptions and discretionary refunds</h2>
      <p>
        We may, at our discretion, issue a refund or credit in the following
        situations:
      </p>
      <ul>
        <li>
          <strong>Duplicate or erroneous charges</strong> caused by a billing
          error on our side.
        </li>
        <li>
          <strong>Service failure</strong> where a confirmed, prolonged outage
          materially prevented you from using the Service and was not caused by
          your configuration, your end customers, or a third-party dependency
          outside our reasonable control.
        </li>
        <li>
          <strong>Unauthorised transactions</strong> that you report promptly and
          that we confirm were not authorised by you.
        </li>
      </ul>
      <p>
        Discretionary refunds are assessed case by case and do not waive the terms
        of this Policy for future purchases.
      </p>

      <h2>6. What is not refundable</h2>
      <p>The following are not eligible for refunds:</p>
      <ul>
        <li>Credits that have been consumed.</li>
        <li>Monthly allocation credits included with a subscription tier.</li>
        <li>Credit packs where any credit has been used.</li>
        <li>
          Subscription fees for a billing period that has already begun, except as
          set out above.
        </li>
        <li>
          Charges arising from your breach of our{' '}
          <Link href="/terms">Terms of Service</Link> or{' '}
          <Link href="/acceptable-use">Acceptable Use Policy</Link>.
        </li>
      </ul>

      <h2>7. How to request a refund</h2>
      <p>
        To request a refund, email{' '}
        <a href="mailto:billing@shahojai.com">billing@shahojai.com</a> from the
        email address associated with your account, including your workspace name,
        the transaction reference, and the reason for your request. We aim to
        acknowledge requests within <strong>3 business days</strong> and to
        process approved refunds within <strong>10 business days</strong>, subject
        to aamarPay processing times. Refunds are returned to the original payment
        method; we cannot refund to a different method or account.
      </p>

      <h2>8. Chargebacks</h2>
      <p>
        If you have a billing concern, please contact us first so we can resolve
        it. Initiating a chargeback without contacting us may result in suspension
        of your account pending resolution.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update this Refund Policy from time to time. Material changes will
        be communicated through the Service or by email, and the &ldquo;Last
        updated&rdquo; date above will be revised. The Policy in effect at the
        time of your purchase governs that purchase.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any refund or billing question, contact{' '}
        <a href="mailto:billing@shahojai.com">billing@shahojai.com</a>.
      </p>
    </>
  )
}
