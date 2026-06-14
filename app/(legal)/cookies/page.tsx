import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | ShahojAI',
  description:
    'How ShahojAI uses cookies and similar technologies on our website, application, and embeddable widget.',
}

export default function CookiePolicyPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p className="effective">Effective date: 14 June 2026</p>

      <p className="lead">
        This Cookie Policy explains how ShahojAI Technologies Ltd.
        (&ldquo;ShahojAI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;) uses cookies and similar technologies on our website
        and within the ShahojAI application and embeddable widget (collectively,
        the &ldquo;Service&rdquo;). It should be read together with our{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They allow the site to recognise your device, remember your
        preferences, keep you signed in, and understand how the site is used. We
        also use related technologies such as local storage, session storage, and
        pixels; in this Policy we refer to all of these as &ldquo;cookies&rdquo;.
      </p>

      <h2>2. How we use cookies</h2>
      <p>
        ShahojAI uses cookies sparingly and primarily to operate the Service. We
        group the cookies we use into the categories below.
      </p>

      <h3>2.1 Strictly necessary cookies</h3>
      <p>
        These cookies are essential for the Service to function and cannot be
        switched off in our systems. They are usually set in response to actions
        you take, such as signing in, setting privacy preferences, or submitting
        forms.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie / storage key</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>sb-access-token</code> / <code>sb-refresh-token</code>
            </td>
            <td>Supabase authentication session &mdash; keeps you signed in</td>
            <td>Session / up to 30 days</td>
          </tr>
          <tr>
            <td>
              <code>shahoj_csrf</code>
            </td>
            <td>Cross-site request forgery protection</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>
              <code>shahoj_consent</code>
            </td>
            <td>Stores your cookie-consent choices</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>
              Local storage: <code>shahoj_workspace</code>
            </td>
            <td>Remembers your active workspace and UI preferences</td>
            <td>Persistent until cleared</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Functional cookies</h3>
      <p>
        These cookies enable enhanced functionality and personalisation, such as
        remembering your language preference (Bengali or English) and interface
        settings. If you disable them, some features may not work as intended.
      </p>

      <h3>2.3 Analytics cookies</h3>
      <p>
        We use privacy-respecting, aggregated analytics to understand how the
        Service is used so we can improve it &mdash; for example, which features
        are used most and where errors occur. These cookies collect information
        in an aggregated form and are only set with your consent where required
        by law.
      </p>

      <h3>2.4 Cookies we do not use</h3>
      <p>
        We do not use third-party advertising cookies, and we do not sell data
        collected through cookies. The embeddable widget on Customer websites
        sets only the strictly necessary cookies required to maintain a
        conversation session.
      </p>

      <h2>3. Cookies set by sub-processors</h2>
      <p>
        Some cookies may be set by the third-party services we rely on to deliver
        the Service, including <strong>Supabase</strong> (authentication
        sessions) and <strong>Vercel</strong> (hosting, edge routing, and
        security). These providers act as our sub-processors and are described in
        our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>4. Managing your preferences</h2>
      <p>
        When you first visit our website, we present a consent banner that lets
        you accept or reject non-essential cookies. You can change your choices at
        any time through the &ldquo;Cookie preferences&rdquo; link in the website
        footer.
      </p>
      <p>
        You can also control cookies through your browser settings, including
        blocking or deleting cookies. Most browsers let you do this via their
        settings or help menus. Please note that blocking strictly necessary
        cookies may prevent you from signing in or using core parts of the
        Service.
      </p>
      <p>
        For end customers interacting with the ShahojAI widget on a
        Customer&rsquo;s website, the Customer is responsible for obtaining any
        cookie consent required on their site; we provide only the cookies
        necessary to operate the chat session.
      </p>

      <h2>5. Changes to this Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in
        technology, law, or our practices. When we do, we will update the
        &ldquo;Last updated&rdquo; date above and, where appropriate, notify you
        through the Service.
      </p>

      <h2>6. Contact</h2>
      <p>
        If you have questions about our use of cookies, contact us at{' '}
        <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a>.
      </p>
    </>
  )
}
