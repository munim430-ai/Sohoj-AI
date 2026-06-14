import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Processing Agreement | ShahojAI',
  description:
    'The DPA governing ShahojAI processing of personal data on behalf of Customers, including GDPR roles, sub-processors, and transfers.',
}

export default function DataProcessingAgreementPage() {
  return (
    <>
      <h1>Data Processing Agreement</h1>
      <p className="effective">Effective date: 14 June 2026</p>

      <p className="lead">
        This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the{' '}
        <Link href="/terms">Terms of Service</Link> (the &ldquo;Agreement&rdquo;)
        between ShahojAI Technologies Ltd. (&ldquo;ShahojAI&rdquo;,
        &ldquo;Processor&rdquo;) and the customer that has agreed to the Terms of
        Service (&ldquo;Customer&rdquo;, &ldquo;Controller&rdquo;). It governs the
        processing of personal data by ShahojAI on the Customer&rsquo;s behalf in
        connection with the ShahojAI platform (the &ldquo;Service&rdquo;). Where
        there is any conflict between this DPA and the Agreement with respect to
        the processing of personal data, this DPA prevails.
      </p>
      <p>
        This DPA reflects the parties&rsquo; agreement on the processing of
        personal data in accordance with the requirements of Regulation (EU)
        2016/679 (&ldquo;GDPR&rdquo;), the UK GDPR, and applicable Bangladeshi
        data-protection law.
      </p>

      <h2>1. Definitions</h2>
      <ul>
        <li>
          <strong>
            &ldquo;Controller&rdquo;, &ldquo;Processor&rdquo;, &ldquo;Data
            Subject&rdquo;, &ldquo;Personal Data&rdquo;, &ldquo;Processing&rdquo;,
            and &ldquo;Supervisory Authority&rdquo;
          </strong>{' '}
          have the meanings given in the GDPR.
        </li>
        <li>
          <strong>&ldquo;Customer Personal Data&rdquo;</strong> means personal
          data contained in Customer Content that ShahojAI processes on behalf of
          the Customer, principally the chat messages and support content
          submitted by the Customer&rsquo;s end customers.
        </li>
        <li>
          <strong>&ldquo;Sub-processor&rdquo;</strong> means any third party
          engaged by ShahojAI to process Customer Personal Data.
        </li>
        <li>
          <strong>&ldquo;Data Protection Laws&rdquo;</strong> means all laws
          applicable to the processing of Customer Personal Data under the
          Agreement, including the GDPR, the UK GDPR, and applicable Bangladeshi
          law.
        </li>
      </ul>

      <h2>2. Roles of the parties</h2>
      <p>
        The parties acknowledge that, with respect to Customer Personal Data, the{' '}
        <strong>Customer is the Controller</strong> (or a processor acting on
        behalf of a third-party controller) and{' '}
        <strong>ShahojAI is the Processor</strong>. ShahojAI processes Customer
        Personal Data only on behalf of, and under the documented instructions of,
        the Customer. Where ShahojAI determines the means and purposes of
        processing personal data relating to its own customer relationship (such
        as account and billing data), it acts as a controller, and that processing
        is governed by the <Link href="/privacy">Privacy Policy</Link> rather than
        this DPA.
      </p>

      <h2>3. Scope and details of processing</h2>
      <p>
        The subject matter, nature, and purpose of processing, the types of
        personal data, and the categories of data subjects are described in{' '}
        <strong>Annex I</strong> to this DPA.
      </p>
      <ul>
        <li>
          <strong>Subject matter:</strong> provision of the AI customer-support
          Service to the Customer.
        </li>
        <li>
          <strong>Duration:</strong> the term of the Agreement, plus any retention
          period set out herein.
        </li>
        <li>
          <strong>Nature and purpose:</strong> receiving, storing, embedding,
          retrieving, and using end-customer chat content to generate support
          responses and maintain conversation history.
        </li>
      </ul>

      <h2>4. Customer instructions</h2>
      <p>
        ShahojAI will process Customer Personal Data only on the Customer&rsquo;s
        documented instructions, including with regard to international transfers,
        unless required to do otherwise by law to which ShahojAI is subject; in
        such a case ShahojAI will inform the Customer of that legal requirement
        before processing, unless prohibited by law. The Agreement, this DPA, and
        the Customer&rsquo;s configuration of the Service (including data-retention
        settings) constitute the Customer&rsquo;s complete instructions. ShahojAI
        will inform the Customer if, in its opinion, an instruction infringes Data
        Protection Laws.
      </p>

      <h2>5. Confidentiality</h2>
      <p>
        ShahojAI will ensure that persons authorised to process Customer Personal
        Data are bound by appropriate obligations of confidentiality and are
        limited to those who need access to provide the Service.
      </p>

      <h2>6. Security measures</h2>
      <p>
        Taking into account the state of the art, the costs of implementation, and
        the nature, scope, context, and purposes of processing, ShahojAI
        implements appropriate technical and organisational measures to ensure a
        level of security appropriate to the risk, as described in{' '}
        <strong>Annex II</strong>, including:
      </p>
      <ul>
        <li>Encryption of Customer Personal Data in transit (TLS) and at rest.</li>
        <li>
          Logical tenant isolation, including PostgreSQL row-level security and
          per-tenant vector collections, to prevent one Customer from accessing
          another&rsquo;s data.
        </li>
        <li>
          Access controls based on least privilege, with authentication and audit
          logging.
        </li>
        <li>
          Signature verification of payment webhooks and validation of
          organization ownership on API requests.
        </li>
        <li>
          Regular review of security practices and of sub-processors.
        </li>
      </ul>

      <h2>7. Sub-processing</h2>
      <p>
        The Customer provides general authorisation for ShahojAI to engage
        Sub-processors to process Customer Personal Data. ShahojAI&rsquo;s current
        Sub-processors are listed in <strong>Annex III</strong>. ShahojAI will:
      </p>
      <ul>
        <li>
          Impose data-protection obligations on each Sub-processor that are no
          less protective than those in this DPA, by written contract.
        </li>
        <li>
          Remain liable to the Customer for the performance of each
          Sub-processor&rsquo;s obligations.
        </li>
        <li>
          Give the Customer reasonable prior notice of the addition or replacement
          of a Sub-processor that processes Customer Personal Data, allowing the
          Customer to object on reasonable, data-protection grounds. If the
          Customer objects and the parties cannot reach a resolution, the Customer
          may terminate the affected part of the Service.
        </li>
      </ul>

      <h2>8. Data-subject requests</h2>
      <p>
        Taking into account the nature of the processing, ShahojAI will assist the
        Customer by appropriate technical and organisational measures, insofar as
        possible, to respond to requests from data subjects exercising their
        rights under Data Protection Laws (access, rectification, erasure,
        restriction, portability, and objection). If ShahojAI receives a request
        directly from a data subject relating to Customer Personal Data, it will
        not respond directly except on the Customer&rsquo;s instruction, and will
        promptly forward the request to the Customer.
      </p>

      <h2>9. Personal-data breaches</h2>
      <p>
        ShahojAI will notify the Customer without undue delay, and in any event
        within <strong>72 hours</strong>, after becoming aware of a personal-data
        breach affecting Customer Personal Data. The notification will describe,
        to the extent known, the nature of the breach, the categories and
        approximate number of data subjects and records concerned, the likely
        consequences, and the measures taken or proposed to address it. ShahojAI
        will reasonably assist the Customer in meeting the Customer&rsquo;s
        breach-notification and communication obligations.
      </p>

      <h2>10. Data protection impact assessments</h2>
      <p>
        ShahojAI will provide reasonable assistance to the Customer with any
        data-protection impact assessments and prior consultations with
        Supervisory Authorities that the Customer is required to carry out under
        Data Protection Laws, taking into account the nature of processing and the
        information available to ShahojAI.
      </p>

      <h2>11. International transfers</h2>
      <p>
        To the extent ShahojAI processes Customer Personal Data originating in the
        EEA, the United Kingdom, or Switzerland in a country that has not been
        recognised as providing an adequate level of protection, the parties agree
        that the European Commission&rsquo;s Standard Contractual Clauses (Decision
        2021/914), supplemented by the UK International Data Transfer Addendum
        where applicable, are incorporated into this DPA by reference and apply to
        such transfers. ShahojAI will implement supplementary technical measures,
        such as encryption, where appropriate.
      </p>

      <h2>12. Audit</h2>
      <p>
        ShahojAI will make available to the Customer information reasonably
        necessary to demonstrate compliance with this DPA and will allow for and
        contribute to audits, including inspections, conducted by the Customer or
        an auditor mandated by the Customer, no more than once per year (unless
        required more frequently by a Supervisory Authority), on reasonable prior
        notice, during business hours, and subject to confidentiality obligations.
        ShahojAI may satisfy audit requests by providing summary reports or
        third-party certifications where available.
      </p>

      <h2>13. Return and deletion of data</h2>
      <p>
        Upon termination or expiry of the Agreement, ShahojAI will, at the
        Customer&rsquo;s choice, delete or return all Customer Personal Data, and
        delete existing copies, unless retention is required by law. ShahojAI will
        make Customer Content available for export for a limited period after
        termination as described in the Agreement. By default, conversation
        records are retained for 12 months and deleting an account triggers
        deletion of associated Customer Personal Data within 90 days, subject to
        the Customer&rsquo;s configured retention settings and applicable
        legal-retention requirements.
      </p>

      <h2>14. Liability</h2>
      <p>
        Each party&rsquo;s liability arising out of or related to this DPA is
        subject to the limitations and exclusions of liability set out in the
        Agreement.
      </p>

      <h2>15. General</h2>
      <p>
        This DPA is governed by the laws of the People&rsquo;s Republic of
        Bangladesh, except that the Standard Contractual Clauses are governed as
        specified within them. If any provision of this DPA is found
        unenforceable, the remaining provisions remain in effect.
      </p>

      <hr />

      <h2>Annex I &mdash; Details of processing</h2>
      <ul>
        <li>
          <strong>Categories of data subjects:</strong> the Customer&rsquo;s end
          customers and prospective customers who interact with the
          Customer&rsquo;s support agent; the Customer&rsquo;s authorised users.
        </li>
        <li>
          <strong>Categories of personal data:</strong> identifiers (name, email,
          phone), order and transaction references, delivery and address details,
          and any other personal data the Customer or its end customers choose to
          include in chat messages and FAQ content.
        </li>
        <li>
          <strong>Special categories of data:</strong> not intended; the Customer
          must not submit special-category data without appropriate safeguards.
        </li>
        <li>
          <strong>Nature of processing:</strong> collection, storage, embedding
          (vectorisation), retrieval, generation of responses, and deletion.
        </li>
        <li>
          <strong>Purpose:</strong> providing AI-powered customer support to the
          Customer.
        </li>
        <li>
          <strong>Duration:</strong> the term of the Agreement, plus the retention
          periods described in Section 13.
        </li>
      </ul>

      <h2>Annex II &mdash; Technical and organisational measures</h2>
      <p>
        Encryption in transit and at rest; tenant isolation via row-level security
        and per-tenant vector collections; least-privilege access controls;
        authentication and session management; audit logging; webhook signature
        verification; secure software-development practices; regular vulnerability
        management and sub-processor review; incident-response procedures.
      </p>

      <h2>Annex III &mdash; Approved Sub-processors</h2>
      <table>
        <thead>
          <tr>
            <th>Sub-processor</th>
            <th>Purpose</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase</td>
            <td>Application database, authentication, storage</td>
            <td>Singapore / EU</td>
          </tr>
          <tr>
            <td>Qdrant</td>
            <td>Vector database for RAG embeddings</td>
            <td>EU / cloud region</td>
          </tr>
          <tr>
            <td>Groq</td>
            <td>LLM inference for response generation</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>aamarPay</td>
            <td>Payment processing (BDT)</td>
            <td>Bangladesh</td>
          </tr>
          <tr>
            <td>Vercel</td>
            <td>Hosting, edge delivery, logging</td>
            <td>Global edge network</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <p>
        By using the Service, the Customer is deemed to have agreed to this DPA. A
        countersigned copy is available on request from{' '}
        <a href="mailto:privacy@shahojai.com">privacy@shahojai.com</a>.
      </p>
    </>
  )
}
