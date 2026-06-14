import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | ShahojAI',
  description:
    'Prohibited uses of the ShahojAI platform, including content rules, AI misuse, platform integrity, and enforcement.',
}

export default function AcceptableUsePolicyPage() {
  return (
    <>
      <h1>Acceptable Use Policy</h1>
      <p className="effective">Effective date: 14 June 2026</p>

      <p className="lead">
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) describes prohibited uses
        of the ShahojAI platform, websites, APIs, and embeddable widget (the
        &ldquo;Service&rdquo;) provided by ShahojAI Technologies Ltd.
        (&ldquo;ShahojAI&rdquo;). It is incorporated into and forms part of our{' '}
        <Link href="/terms">Terms of Service</Link>. By using the Service, you
        (the &ldquo;Customer&rdquo;) agree to this AUP and are responsible for
        ensuring that your users and your end customers comply with it.
      </p>
      <p>
        The goal of this AUP is to protect ShahojAI, our Customers, their end
        customers, and the public, and to keep the Service reliable, secure, and
        lawful. We may update this AUP as threats and use cases evolve.
      </p>

      <h2>1. Prohibited content and conduct</h2>
      <p>
        You must not use the Service to upload, generate, store, transmit, or
        facilitate any content or activity that:
      </p>
      <ul>
        <li>
          <strong>Violates law</strong> &mdash; breaches any applicable law or
          regulation, including the laws of Bangladesh and any jurisdiction where
          your end customers are located.
        </li>
        <li>
          <strong>Infringes rights</strong> &mdash; infringes
          intellectual-property, privacy, publicity, or other rights of any third
          party.
        </li>
        <li>
          <strong>Is harmful or abusive</strong> &mdash; is defamatory,
          harassing, threatening, hateful, or that incites violence or
          discrimination on the basis of protected characteristics.
        </li>
        <li>
          <strong>Is sexual content involving minors</strong> &mdash; depicts,
          promotes, or facilitates child sexual abuse material (CSAM) or the
          sexual exploitation of minors. We report such content to the relevant
          authorities.
        </li>
        <li>
          <strong>Promotes self-harm or serious harm</strong> &mdash; encourages
          suicide, self-harm, or serious physical harm to others.
        </li>
        <li>
          <strong>Facilitates fraud or deception</strong> &mdash; supports
          phishing, scams, impersonation, pyramid schemes, or deceptive
          commercial practices.
        </li>
        <li>
          <strong>Distributes malware</strong> &mdash; contains viruses,
          ransomware, or other malicious code, or facilitates unauthorised access
          to systems or data.
        </li>
        <li>
          <strong>Involves regulated or dangerous goods</strong> &mdash;
          facilitates the unlawful sale of weapons, controlled substances, or
          other restricted items.
        </li>
      </ul>

      <h2>2. Misuse of the AI agent</h2>
      <p>
        Because ShahojAI provides an AI support agent, you must not use the
        Service to:
      </p>
      <ul>
        <li>
          Generate content that is deliberately false or misleading in a way
          likely to cause harm, including disinformation campaigns.
        </li>
        <li>
          Provide professional advice (legal, medical, financial, or similar) to
          end customers without appropriate human oversight and disclaimers.
        </li>
        <li>
          Impersonate ShahojAI, another business, or any individual without
          authorisation.
        </li>
        <li>
          Attempt to extract, reconstruct, or reverse-engineer the underlying
          models, prompts, or training data, or to &ldquo;jailbreak&rdquo; the
          agent into producing prohibited content.
        </li>
        <li>
          Use the agent to make automated decisions that produce legal or
          similarly significant effects on individuals without lawful basis and
          human review.
        </li>
      </ul>

      <h2>3. Platform integrity and security</h2>
      <p>You must not, and must not permit anyone to:</p>
      <ul>
        <li>
          Circumvent, disable, or interfere with credit metering, rate limits,
          billing, authentication, or tenant-isolation controls.
        </li>
        <li>
          Access another tenant&rsquo;s workspace, data, or vector collections,
          or attempt to access data you are not authorised to access.
        </li>
        <li>
          Probe, scan, or test the vulnerability of the Service or breach its
          security except under our coordinated disclosure process; see{' '}
          <a href="mailto:security@shahojai.com">security@shahojai.com</a>.
        </li>
        <li>
          Conduct denial-of-service attacks, send excessive or automated traffic
          beyond your plan&rsquo;s limits, or otherwise impair the availability or
          performance of the Service.
        </li>
        <li>
          Resell, sublicense, or provide the Service to third parties except as
          expressly permitted by your subscription or order form.
        </li>
        <li>
          Use scraping, crawling, or harvesting techniques against the Service
          except through documented APIs within your plan limits.
        </li>
      </ul>

      <h2>4. Data-protection responsibilities</h2>
      <p>
        As the controller of personal data in your Customer Content, you must:
      </p>
      <ul>
        <li>
          Have a lawful basis and any required consents to collect and process
          your end customers&rsquo; personal data through the Service.
        </li>
        <li>
          Provide your end customers with appropriate privacy notices and, where
          required, cookie consent on your own properties.
        </li>
        <li>
          Not upload special-category data (such as health, biometric, or
          financial-account data) into the Service unless you have implemented
          appropriate safeguards and a lawful basis.
        </li>
        <li>
          Comply with the obligations set out in our{' '}
          <Link href="/dpa">Data Processing Agreement</Link>.
        </li>
      </ul>

      <h2>5. Fair use of credits and resources</h2>
      <p>
        The Service is metered using credits. Automated or artificial inflation
        of usage, sharing of accounts to evade limits, or attempts to obtain
        credits without payment are prohibited. We may apply reasonable rate
        limits to protect the stability of the Service for all Customers.
      </p>

      <h2>6. Reporting violations</h2>
      <p>
        If you become aware of any violation of this AUP, including abuse of an AI
        agent deployed through the Service or content that may involve serious
        harm, report it to{' '}
        <a href="mailto:abuse@shahojai.com">abuse@shahojai.com</a>. For security
        vulnerabilities, contact{' '}
        <a href="mailto:security@shahojai.com">security@shahojai.com</a>.
      </p>

      <h2>7. Enforcement</h2>
      <p>
        We may investigate suspected violations of this AUP. Depending on
        severity, we may take action including issuing a warning, throttling
        usage, removing content, suspending features, or suspending or
        terminating your account. Where content involves imminent risk of serious
        harm or unlawful material, we may act immediately and without prior notice
        and may notify or cooperate with law-enforcement authorities. Termination
        for AUP violations is governed by our{' '}
        <Link href="/terms">Terms of Service</Link>.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this AUP from time to time. Material changes will be
        communicated through the Service or by email, and the &ldquo;Last
        updated&rdquo; date above will be revised. Continued use of the Service
        after an update constitutes acceptance of the revised AUP.
      </p>
    </>
  )
}
