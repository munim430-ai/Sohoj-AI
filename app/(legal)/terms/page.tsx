import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | ShahojAI',
  description:
    'The terms governing your use of ShahojAI, including subscription tiers, credits, acceptable use, liability, and governing law.',
}

export default function TermsOfServicePage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="effective">Effective date: 14 June 2026</p>

      <p className="lead">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the ShahojAI platform, websites, APIs, embeddable widgets, and
        related services (collectively, the &ldquo;Service&rdquo;) provided by
        ShahojAI Technologies Ltd. (&ldquo;ShahojAI&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a company operating from Dhaka,
        Bangladesh. The Service is offered on a business-to-business basis to
        e-commerce sellers and other organizations (&ldquo;Customer&rdquo;,
        &ldquo;you&rdquo;, or &ldquo;your&rdquo;).
      </p>
      <p>
        By creating an account, clicking &ldquo;I agree&rdquo;, or otherwise
        accessing or using the Service, you agree to these Terms. If you are
        entering into these Terms on behalf of a company or other legal entity,
        you represent that you have authority to bind that entity. If you do not
        agree, you must not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        ShahojAI provides a multi-tenant, AI-powered customer-support agent that
        uses retrieval-augmented generation (&ldquo;RAG&rdquo;) to answer your
        end customers&rsquo; questions in Bengali and English. Features include a
        white-label support agent, an embeddable chat widget, FAQ/document
        ingestion, conversation history, and billing managed through aamarPay. We
        may add, modify, or remove features over time.
      </p>

      <h2>2. Accounts and eligibility</h2>
      <p>
        You must register for an account to use the Service. You agree to provide
        accurate, current information and to keep it up to date. You are
        responsible for safeguarding your credentials and for all activity that
        occurs under your account, including the acts of users you invite to your
        workspace. You must be at least 18 years old and capable of forming a
        binding contract.
      </p>

      <h2>3. Subscription tiers</h2>
      <p>
        The Service is offered under the following subscription tiers. Current
        pricing and credit allowances are published on our billing page and may
        be updated on renewal.
      </p>
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Monthly credits</th>
            <th>Indicative price</th>
            <th>Key entitlements</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Starter</strong>
            </td>
            <td>500 credits / month</td>
            <td>&#2547;2,500 / month</td>
            <td>
              Single workspace, embeddable widget, Bengali &amp; English
              support, FAQ uploads, standard email support
            </td>
          </tr>
          <tr>
            <td>
              <strong>Pro</strong>
            </td>
            <td>2,000 credits / month</td>
            <td>&#2547;8,000 / month</td>
            <td>
              Everything in Starter, white-label branding, higher rate limits,
              priority email support
            </td>
          </tr>
          <tr>
            <td>
              <strong>Enterprise</strong>
            </td>
            <td>Custom / high-volume</td>
            <td>Custom (contact sales)</td>
            <td>
              Everything in Pro, custom domain, dedicated onboarding, SLA,
              custom data-retention terms, invoicing
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Tier entitlements, including custom domains and white-labeling, are
        described on our pricing page and may depend on your tier. Enterprise
        terms may be set out in a separate order form, which prevails over these
        Terms to the extent of any conflict.
      </p>

      <h2>4. Credits and usage</h2>
      <p>
        The Service operates on a credit system. Each AI-generated response,
        embedding operation, or other metered action consumes credits at the
        rates published in your workspace.
      </p>
      <ul>
        <li>
          Each subscription tier includes a monthly allocation of credits that
          resets at the start of each billing period.
        </li>
        <li>
          Unused monthly credits <strong>do not roll over</strong> to the next
          billing period unless your order form states otherwise.
        </li>
        <li>
          You may purchase additional pay-as-you-go credit packs at any time.
          Purchased credit packs are added to your balance and consumed after
          your monthly allocation.
        </li>
        <li>
          Once your credit balance is exhausted, AI features are paused until you
          purchase more credits or your monthly allocation resets.
        </li>
        <li>
          Credit consumption is final once an action has been performed. Refund
          eligibility is governed by our{' '}
          <Link href="/refunds">Refund Policy</Link>.
        </li>
      </ul>

      <h2>5. Fees, billing, and taxes</h2>
      <p>
        All fees are stated and charged in Bangladeshi Taka (BDT, &#2547;) and
        are processed through aamarPay. Subscriptions renew automatically at the
        end of each billing period unless cancelled before the renewal date. You
        authorise us and our payment processor to charge your designated payment
        method for all applicable fees. Fees are exclusive of taxes, levies, or
        duties, which you are responsible for paying except for taxes based on
        our net income. Late or failed payments may result in suspension of the
        Service. Refunds, where available, are governed by our{' '}
        <Link href="/refunds">Refund Policy</Link>.
      </p>

      <h2>6. Customer content and data</h2>
      <p>
        You retain all rights in the content you and your end customers submit to
        the Service (&ldquo;Customer Content&rdquo;), including FAQ documents and
        conversation data. You grant ShahojAI a limited, non-exclusive licence to
        host, process, transmit, and display Customer Content solely to provide
        and improve the Service for you. With respect to personal data within
        Customer Content, you act as the data controller and ShahojAI acts as
        your processor; this processing is governed by our{' '}
        <Link href="/dpa">Data Processing Agreement</Link>, which is incorporated
        into these Terms. You are responsible for ensuring you have all necessary
        rights and consents to submit Customer Content and for the lawfulness of
        your end-customer interactions.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        Your use of the Service is subject to our{' '}
        <Link href="/acceptable-use">Acceptable Use Policy</Link>, which is
        incorporated by reference. You must not, and must not permit others to,
        misuse the Service, including by using it for unlawful, harmful,
        infringing, or abusive purposes, attempting to circumvent credit metering
        or security controls, reverse-engineering the Service, or reselling
        access without authorisation. We may suspend or terminate access for
        violations.
      </p>

      <h2>8. AI output disclaimer</h2>
      <p>
        The Service uses large language models to generate responses. AI output
        may be inaccurate, incomplete, or unsuitable for a given context, and it
        does not constitute professional, legal, medical, or financial advice.
        You are responsible for reviewing and configuring the agent and for any
        reliance on, or publication of, AI output to your end customers. You
        should implement appropriate human oversight for high-stakes
        interactions.
      </p>

      <h2>9. Service levels and availability</h2>
      <p>
        We strive to keep the Service available and performant, but except where
        an Enterprise SLA expressly applies, the Service is provided on an
        &ldquo;as available&rdquo; basis. We may perform maintenance, and we may
        modify or discontinue features with reasonable notice. Scheduled
        maintenance, third-party outages (including those of our sub-processors),
        and force-majeure events may affect availability.
      </p>

      <h2>10. Intellectual property</h2>
      <p>
        The Service, including all software, models, designs, and trademarks, is
        and remains the property of ShahojAI and its licensors. Except for the
        limited right to use the Service under these Terms, no rights are granted
        to you. The &ldquo;Powered by ShahojAI&rdquo; attribution may be
        displayed in the widget except where your tier permits its removal.
      </p>

      <h2>11. Confidentiality</h2>
      <p>
        Each party may receive confidential information of the other. The
        receiving party will protect such information with reasonable care, use
        it only to perform under these Terms, and not disclose it except to
        personnel and contractors bound by confidentiality obligations, or as
        required by law.
      </p>

      <h2>12. Term, suspension, and termination</h2>
      <p>
        These Terms remain in effect while you use the Service. You may cancel
        your subscription at any time, effective at the end of the current
        billing period. We may suspend or terminate your access immediately if
        you materially breach these Terms, fail to pay, or use the Service in a
        way that creates risk or legal exposure for ShahojAI or others. Upon
        termination, your right to use the Service ends, and we will make
        Customer Content available for export for a limited period before
        deletion in accordance with our <Link href="/privacy">Privacy Policy</Link>{' '}
        and <Link href="/dpa">Data Processing Agreement</Link>.
      </p>

      <h2>13. Warranties and disclaimers</h2>
      <p>
        EXCEPT AS EXPRESSLY STATED IN THESE TERMS, THE SERVICE IS PROVIDED
        &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF
        ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED
        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
        ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL
        BE UNINTERRUPTED, ERROR-FREE, OR THAT AI OUTPUT WILL BE ACCURATE.
      </p>

      <h2>14. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR
        ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
        FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR
        RELATING TO THESE TERMS OR THE SERVICE, WHETHER IN CONTRACT, TORT, OR
        OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. EXCEPT FOR
        YOUR PAYMENT OBLIGATIONS AND EITHER PARTY&rsquo;S INDEMNIFICATION
        OBLIGATIONS, EACH PARTY&rsquo;S TOTAL AGGREGATE LIABILITY ARISING OUT OF
        OR RELATING TO THESE TERMS WILL NOT EXCEED THE TOTAL FEES YOU PAID TO
        SHAHOJAI IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE
        LIABILITY.
      </p>

      <h2>15. Indemnification</h2>
      <p>
        You will defend, indemnify, and hold harmless ShahojAI from and against
        any third-party claims, damages, and expenses (including reasonable legal
        fees) arising from your Customer Content, your end-customer interactions,
        or your breach of these Terms or the Acceptable Use Policy.
      </p>

      <h2>16. Governing law and dispute resolution</h2>
      <p>
        These Terms are governed by the laws of the People&rsquo;s Republic of
        Bangladesh, without regard to conflict-of-law principles. The courts of
        Dhaka, Bangladesh, will have exclusive jurisdiction over any dispute
        arising out of or relating to these Terms, and you consent to that
        jurisdiction and venue. Nothing in this section limits a party&rsquo;s
        right to seek injunctive relief to protect its intellectual property or
        confidential information.
      </p>

      <h2>17. Changes to these Terms</h2>
      <p>
        We may revise these Terms from time to time. When changes are material,
        we will notify you by email or through the Service and update the
        &ldquo;Last updated&rdquo; date. Continued use of the Service after the
        effective date of revised Terms constitutes acceptance.
      </p>

      <h2>18. General</h2>
      <p>
        These Terms, together with the policies incorporated by reference and any
        applicable order form, constitute the entire agreement between you and
        ShahojAI regarding the Service. If any provision is held unenforceable,
        the remaining provisions remain in effect. Our failure to enforce a
        provision is not a waiver. You may not assign these Terms without our
        consent; we may assign them to an affiliate or successor. Notices to
        ShahojAI may be sent to{' '}
        <a href="mailto:legal@shahojai.com">legal@shahojai.com</a>.
      </p>
    </>
  )
}
