import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | ShahojAI',
  description:
    'How ShahojAI collects, uses, and protects personal data, including GDPR and Bangladesh context, sub-processors, retention, and your rights.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="effective">Effective date: 14 June 2026</p>

      <p className="lead">
        ShahojAI Technologies Ltd. (&ldquo;ShahojAI&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the ShahojAI platform
        (the &ldquo;Platform&rdquo;), a multi-tenant, AI-powered
        customer-support service for e-commerce sellers. This Privacy Policy
        explains how we collect, use, disclose, and safeguard personal data when
        you visit our website, create an account, or use the Platform.
      </p>
      <p>
        This Policy is written to satisfy our obligations under the EU General
        Data Protection Regulation (Regulation (EU) 2016/679, &ldquo;GDPR&rdquo;),
        the UK GDPR, and applicable Bangladeshi law, including the constitutional
        right to privacy under Article 43 of the Constitution of the People&rsquo;s
        Republic of Bangladesh and any data-protection legislation enacted in
        Bangladesh. Where our customers are located in the European Economic Area
        (&ldquo;EEA&rdquo;), the United Kingdom, or Switzerland, the GDPR-specific
        provisions of this Policy apply.
      </p>
      <p>
        Because ShahojAI is a business-to-business (&ldquo;B2B&rdquo;) service,
        our relationship with personal data falls into two categories:
      </p>
      <ul>
        <li>
          <strong>Account data</strong> &mdash; personal data about the
          businesses and individuals who register for and administer a ShahojAI
          workspace (&ldquo;Customers&rdquo;). For this data we act as a{' '}
          <strong>data controller</strong>.
        </li>
        <li>
          <strong>End-customer data</strong> &mdash; personal data contained in
          the chat messages and support content that a Customer&rsquo;s end users
          send to that Customer&rsquo;s support agent, and which the Customer
          routes through ShahojAI. For this data we act as a{' '}
          <strong>data processor</strong> on the Customer&rsquo;s behalf,
          governed by our <Link href="/dpa">Data Processing Agreement</Link>.
        </li>
      </ul>

      <h2>1. Who we are and how to contact us</h2>
      <p>
        ShahojAI Technologies Ltd. is a company registered in Bangladesh and
        operating from Dhaka. For any privacy question, request, or complaint,
        contact our privacy team:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{' '}
          <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a>
        </li>
        <li>
          <strong>Post:</strong> Data Protection, ShahojAI Technologies Ltd.,
          Dhaka, Bangladesh
        </li>
      </ul>
      <p>We aim to respond to all privacy enquiries within 30 days.</p>

      <h2>2. Personal data we collect</h2>
      <h3>2.1 Information you provide to us</h3>
      <ul>
        <li>
          <strong>Identity and account data:</strong> name, business name, email
          address, phone number, job title, and password (stored only as a
          salted hash).
        </li>
        <li>
          <strong>Organization data:</strong> company name, workspace slug,
          branding details (logo, brand colours), custom domain, and
          subscription tier.
        </li>
        <li>
          <strong>Billing data:</strong> billing contact, transaction history,
          invoice records, and the BDT amounts charged. Card and mobile-wallet
          details are collected and processed directly by our payment processor,
          aamarPay; we do not store full payment-instrument numbers on our
          systems.
        </li>
        <li>
          <strong>Support and communications:</strong> messages you send to us,
          support tickets, and survey responses.
        </li>
      </ul>
      <h3>2.2 Information we collect automatically</h3>
      <ul>
        <li>
          <strong>Usage and telemetry data:</strong> pages viewed, features
          used, credit consumption, conversation counts, API request metadata,
          timestamps, and error logs.
        </li>
        <li>
          <strong>Device and connection data:</strong> IP address, browser type
          and version, operating system, language preference, and approximate
          location derived from IP.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> see our{' '}
          <Link href="/cookies">Cookie Policy</Link>.
        </li>
      </ul>
      <h3>2.3 End-customer content (processed on behalf of Customers)</h3>
      <p>
        When a Customer deploys the ShahojAI embeddable widget or agent, end
        users of that Customer may submit chat messages that contain personal
        data (for example, names, order numbers, delivery addresses, or phone
        numbers). ShahojAI receives, stores, embeds, and processes this content{' '}
        <strong>
          solely to provide the support service to the relevant Customer
        </strong>{' '}
        and strictly under the Customer&rsquo;s instructions. We do not determine
        the purposes of this processing and we are not the controller of it.
      </p>

      <h2>3. How we use personal data and our legal bases</h2>
      <p>
        For data where we act as controller, we rely on the following GDPR legal
        bases:
      </p>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Categories of data</th>
            <th>Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Creating and administering your account</td>
            <td>Identity, account, organization data</td>
            <td>Performance of a contract (Art. 6(1)(b))</td>
          </tr>
          <tr>
            <td>Providing and operating the Platform</td>
            <td>Account, usage, organization data</td>
            <td>Performance of a contract (Art. 6(1)(b))</td>
          </tr>
          <tr>
            <td>Processing payments and managing credits</td>
            <td>Billing data</td>
            <td>Contract (Art. 6(1)(b)); legal obligation (Art. 6(1)(c))</td>
          </tr>
          <tr>
            <td>Securing the Platform and preventing abuse</td>
            <td>Usage, device, log data</td>
            <td>Legitimate interests (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Improving and developing features</td>
            <td>Aggregated and pseudonymised usage data</td>
            <td>Legitimate interests (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Sending service and transactional emails</td>
            <td>Identity, account data</td>
            <td>Performance of a contract (Art. 6(1)(b))</td>
          </tr>
          <tr>
            <td>Sending marketing communications</td>
            <td>Identity, account data</td>
            <td>Consent (Art. 6(1)(a)), withdrawable at any time</td>
          </tr>
          <tr>
            <td>Complying with legal, tax, and accounting duties</td>
            <td>Billing, account data</td>
            <td>Legal obligation (Art. 6(1)(c))</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do not use end-customer content to train, fine-tune, or improve any
        general-purpose machine-learning model, and we do not sell personal
        data.
      </p>

      <h2>4. Sub-processors</h2>
      <p>
        To deliver the Platform we rely on a small number of carefully selected
        sub-processors. Each is bound by a written agreement that imposes
        data-protection obligations consistent with this Policy and, where
        applicable, the GDPR&rsquo;s requirements for processors (Art. 28).
      </p>
      <table>
        <thead>
          <tr>
            <th>Sub-processor</th>
            <th>Function</th>
            <th>Data processed</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Supabase</strong>
            </td>
            <td>Primary database, authentication, and storage (PostgreSQL)</td>
            <td>Account, organization, billing metadata, conversations</td>
            <td>Singapore / EU regions</td>
          </tr>
          <tr>
            <td>
              <strong>Qdrant</strong>
            </td>
            <td>Vector database for retrieval-augmented generation (RAG)</td>
            <td>Vectorised representations of FAQ and support content</td>
            <td>EU / cloud region</td>
          </tr>
          <tr>
            <td>
              <strong>Groq</strong>
            </td>
            <td>Large-language-model inference for support responses</td>
            <td>Chat prompts and retrieved context (transient)</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>
              <strong>aamarPay</strong>
            </td>
            <td>Payment processing in BDT</td>
            <td>Billing and transaction data</td>
            <td>Bangladesh</td>
          </tr>
          <tr>
            <td>
              <strong>Vercel</strong>
            </td>
            <td>Application hosting, edge network, and content delivery</td>
            <td>Request metadata, IP addresses, logs</td>
            <td>Global edge network</td>
          </tr>
        </tbody>
      </table>
      <p>
        A current list of sub-processors is available on request from{' '}
        <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a>. We will
        give Customers reasonable prior notice of any intended addition or
        replacement of a sub-processor that processes end-customer content,
        allowing the Customer to object as described in our{' '}
        <Link href="/dpa">Data Processing Agreement</Link>.
      </p>

      <h2>5. International data transfers</h2>
      <p>
        ShahojAI operates from Bangladesh, and several of our sub-processors
        process data outside the country, including in the United States and the
        EEA. Where we transfer personal data originating in the EEA, the UK, or
        Switzerland to a country that has not received an adequacy decision, we
        rely on appropriate safeguards under Chapter V of the GDPR, principally
        the European Commission&rsquo;s Standard Contractual Clauses (2021/914)
        supplemented by the UK Addendum where required, together with
        transfer-impact assessments and additional technical measures such as
        encryption in transit and at rest.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain personal data only for as long as necessary for the purposes
        set out in this Policy:
      </p>
      <ul>
        <li>
          <strong>Account data</strong> is retained for the life of your account
          and for up to <strong>90 days</strong> after account closure, after
          which it is deleted or irreversibly anonymised, except where a longer
          period is required by law.
        </li>
        <li>
          <strong>Conversation and end-customer content</strong> is retained
          according to the retention period configured by the Customer. By
          default, conversation records are retained for{' '}
          <strong>12 months</strong>, after which they are deleted. Customers may
          shorten this period or request earlier deletion at any time.
        </li>
        <li>
          <strong>Vector embeddings</strong> in Qdrant persist for as long as the
          underlying FAQ documents remain in the workspace; deleting a document
          removes its associated embeddings.
        </li>
        <li>
          <strong>Billing and tax records</strong> are retained for{' '}
          <strong>6 years</strong> to meet Bangladeshi accounting and
          tax-record obligations.
        </li>
        <li>
          <strong>Security and audit logs</strong> are retained for up to{' '}
          <strong>12 months</strong>.
        </li>
      </ul>

      <h2>7. Your rights</h2>
      <p>
        Depending on your location and the applicable law, you may have the
        following rights in respect of personal data for which we are the
        controller:
      </p>
      <ul>
        <li>
          <strong>Access</strong> &mdash; to obtain a copy of the personal data
          we hold about you.
        </li>
        <li>
          <strong>Rectification</strong> &mdash; to correct inaccurate or
          incomplete data.
        </li>
        <li>
          <strong>Erasure</strong> &mdash; to request deletion of your data
          (&ldquo;right to be forgotten&rdquo;).
        </li>
        <li>
          <strong>Restriction</strong> &mdash; to limit how we process your data
          in certain circumstances.
        </li>
        <li>
          <strong>Portability</strong> &mdash; to receive your data in a
          structured, machine-readable format.
        </li>
        <li>
          <strong>Objection</strong> &mdash; to object to processing based on
          legitimate interests or to direct marketing.
        </li>
        <li>
          <strong>Withdrawal of consent</strong> &mdash; where we rely on
          consent, you may withdraw it at any time without affecting prior
          processing.
        </li>
        <li>
          <strong>Complaint</strong> &mdash; to lodge a complaint with a
          supervisory authority, such as your local EEA Data Protection
          Authority or the UK Information Commissioner&rsquo;s Office.
        </li>
      </ul>
      <p>
        To exercise any right, email{' '}
        <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a>. We will
        verify your identity before acting on a request and respond within 30
        days. Where personal data relates to a Customer&rsquo;s end users (data
        we process, not control), we will refer the request to the relevant
        Customer, who is the controller, and assist them in responding.
      </p>

      <h2>8. Security</h2>
      <p>
        We implement technical and organisational measures appropriate to the
        risk, including encryption of data in transit (TLS) and at rest, tenant
        isolation enforced through PostgreSQL row-level security, strict access
        controls and least-privilege access for staff, secure credential
        storage, signature verification on payment webhooks, audit logging, and
        regular review of our sub-processors. No method of transmission or
        storage is perfectly secure, but we work continuously to protect your
        data and to detect and respond to incidents. To report a vulnerability,
        email <a href="mailto:security@shahojai.com">security@shahojai.com</a>.
      </p>

      <h2>9. Children&rsquo;s data</h2>
      <p>
        The Platform is a B2B service not directed to children. We do not
        knowingly collect personal data from anyone under the age of 18. If you
        believe a child has provided us personal data, contact{' '}
        <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a> and we
        will delete it.
      </p>

      <h2>10. Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. When we make material
        changes, we will notify Customers by email or through the Platform and
        update the &ldquo;Last updated&rdquo; date above. Continued use of the
        Platform after an update constitutes acceptance of the revised Policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        For any question about this Policy or our data practices, contact our
        privacy team at{' '}
        <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a>.
      </p>
    </>
  )
}
