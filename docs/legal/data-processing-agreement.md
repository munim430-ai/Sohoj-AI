# Data Processing Agreement

**Effective date: 14 June 2026**
**Last updated: June 2026**

This Data Processing Agreement ("DPA") forms part of the [Terms of Service](/terms) (the "Agreement") between ShahojAI Technologies Ltd. ("ShahojAI", "Processor") and the customer that has agreed to the Terms of Service ("Customer", "Controller"). It governs the processing of personal data by ShahojAI on the Customer's behalf in connection with the ShahojAI platform (the "Service"). Where there is any conflict between this DPA and the Agreement with respect to the processing of personal data, this DPA prevails.

This DPA reflects the parties' agreement on the processing of personal data in accordance with the requirements of Regulation (EU) 2016/679 ("GDPR"), the UK GDPR, and applicable Bangladeshi data-protection law.

## 1. Definitions

- **"Controller"**, **"Processor"**, **"Data Subject"**, **"Personal Data"**, **"Processing"**, and **"Supervisory Authority"** have the meanings given in the GDPR.
- **"Customer Personal Data"** means personal data contained in Customer Content that ShahojAI processes on behalf of the Customer, principally the chat messages and support content submitted by the Customer's end customers.
- **"Sub-processor"** means any third party engaged by ShahojAI to process Customer Personal Data.
- **"Data Protection Laws"** means all laws applicable to the processing of Customer Personal Data under the Agreement, including the GDPR, the UK GDPR, and applicable Bangladeshi law.

## 2. Roles of the parties

The parties acknowledge that, with respect to Customer Personal Data, the **Customer is the Controller** (or a processor acting on behalf of a third-party controller) and **ShahojAI is the Processor**. ShahojAI processes Customer Personal Data only on behalf of, and under the documented instructions of, the Customer. Where ShahojAI determines the means and purposes of processing personal data relating to its own customer relationship (such as account and billing data), it acts as a controller, and that processing is governed by the [Privacy Policy](/privacy) rather than this DPA.

## 3. Scope and details of processing

The subject matter, nature, and purpose of processing, the types of personal data, and the categories of data subjects are described in **Annex I** to this DPA.

- **Subject matter:** provision of the AI customer-support Service to the Customer.
- **Duration:** the term of the Agreement, plus any retention period set out herein.
- **Nature and purpose:** receiving, storing, embedding, retrieving, and using end-customer chat content to generate support responses and maintain conversation history.

## 4. Customer instructions

ShahojAI will process Customer Personal Data only on the Customer's documented instructions, including with regard to international transfers, unless required to do otherwise by law to which ShahojAI is subject; in such a case ShahojAI will inform the Customer of that legal requirement before processing, unless prohibited by law. The Agreement, this DPA, and the Customer's configuration of the Service (including data-retention settings) constitute the Customer's complete instructions. ShahojAI will inform the Customer if, in its opinion, an instruction infringes Data Protection Laws.

## 5. Confidentiality

ShahojAI will ensure that persons authorised to process Customer Personal Data are bound by appropriate obligations of confidentiality and are limited to those who need access to provide the Service.

## 6. Security measures

Taking into account the state of the art, the costs of implementation, and the nature, scope, context, and purposes of processing, ShahojAI implements appropriate technical and organisational measures to ensure a level of security appropriate to the risk, as described in **Annex II**, including:

- Encryption of Customer Personal Data in transit (TLS) and at rest.
- Logical tenant isolation, including PostgreSQL row-level security and per-tenant vector collections, to prevent one Customer from accessing another's data.
- Access controls based on least privilege, with authentication and audit logging.
- Signature verification of payment webhooks and validation of organization ownership on API requests.
- Regular review of security practices and of sub-processors.

## 7. Sub-processing

The Customer provides general authorisation for ShahojAI to engage Sub-processors to process Customer Personal Data. ShahojAI's current Sub-processors are listed in **Annex III**. ShahojAI will:

- Impose data-protection obligations on each Sub-processor that are no less protective than those in this DPA, by written contract.
- Remain liable to the Customer for the performance of each Sub-processor's obligations.
- Give the Customer reasonable prior notice of the addition or replacement of a Sub-processor that processes Customer Personal Data, allowing the Customer to object on reasonable, data-protection grounds. If the Customer objects and the parties cannot reach a resolution, the Customer may terminate the affected part of the Service.

## 8. Data-subject requests

Taking into account the nature of the processing, ShahojAI will assist the Customer by appropriate technical and organisational measures, insofar as possible, to respond to requests from data subjects exercising their rights under Data Protection Laws (access, rectification, erasure, restriction, portability, and objection). If ShahojAI receives a request directly from a data subject relating to Customer Personal Data, it will not respond directly except on the Customer's instruction, and will promptly forward the request to the Customer.

## 9. Personal-data breaches

ShahojAI will notify the Customer without undue delay, and in any event within **72 hours**, after becoming aware of a personal-data breach affecting Customer Personal Data. The notification will describe, to the extent known, the nature of the breach, the categories and approximate number of data subjects and records concerned, the likely consequences, and the measures taken or proposed to address it. ShahojAI will reasonably assist the Customer in meeting the Customer's breach-notification and communication obligations.

## 10. Data protection impact assessments

ShahojAI will provide reasonable assistance to the Customer with any data-protection impact assessments and prior consultations with Supervisory Authorities that the Customer is required to carry out under Data Protection Laws, taking into account the nature of processing and the information available to ShahojAI.

## 11. International transfers

To the extent ShahojAI processes Customer Personal Data originating in the EEA, the United Kingdom, or Switzerland in a country that has not been recognised as providing an adequate level of protection, the parties agree that the European Commission's Standard Contractual Clauses (Decision 2021/914), supplemented by the UK International Data Transfer Addendum where applicable, are incorporated into this DPA by reference and apply to such transfers. ShahojAI will implement supplementary technical measures, such as encryption, where appropriate.

## 12. Audit

ShahojAI will make available to the Customer information reasonably necessary to demonstrate compliance with this DPA and will allow for and contribute to audits, including inspections, conducted by the Customer or an auditor mandated by the Customer, no more than once per year (unless required more frequently by a Supervisory Authority), on reasonable prior notice, during business hours, and subject to confidentiality obligations. ShahojAI may satisfy audit requests by providing summary reports or third-party certifications where available.

## 13. Return and deletion of data

Upon termination or expiry of the Agreement, ShahojAI will, at the Customer's choice, delete or return all Customer Personal Data, and delete existing copies, unless retention is required by law. ShahojAI will make Customer Content available for export for a limited period after termination as described in the Agreement. By default, conversation records are retained for 12 months and deleting an account triggers deletion of associated Customer Personal Data within 90 days, subject to the Customer's configured retention settings and applicable legal-retention requirements.

## 14. Liability

Each party's liability arising out of or related to this DPA is subject to the limitations and exclusions of liability set out in the Agreement.

## 15. General

This DPA is governed by the laws of the People's Republic of Bangladesh, except that the Standard Contractual Clauses are governed as specified within them. If any provision of this DPA is found unenforceable, the remaining provisions remain in effect.

---

## Annex I — Details of processing

- **Categories of data subjects:** the Customer's end customers and prospective customers who interact with the Customer's support agent; the Customer's authorised users.
- **Categories of personal data:** identifiers (name, email, phone), order and transaction references, delivery and address details, and any other personal data the Customer or its end customers choose to include in chat messages and FAQ content.
- **Special categories of data:** not intended; the Customer must not submit special-category data without appropriate safeguards.
- **Nature of processing:** collection, storage, embedding (vectorisation), retrieval, generation of responses, and deletion.
- **Purpose:** providing AI-powered customer support to the Customer.
- **Duration:** the term of the Agreement, plus the retention periods described in Section 13.

## Annex II — Technical and organisational measures

Encryption in transit and at rest; tenant isolation via row-level security and per-tenant vector collections; least-privilege access controls; authentication and session management; audit logging; webhook signature verification; secure software-development practices; regular vulnerability management and sub-processor review; incident-response procedures.

## Annex III — Approved Sub-processors

| Sub-processor | Purpose | Location |
| --- | --- | --- |
| Supabase | Application database, authentication, storage | Singapore / EU |
| Qdrant | Vector database for RAG embeddings | EU / cloud region |
| Groq | LLM inference for response generation | United States |
| aamarPay | Payment processing (BDT) | Bangladesh |
| Vercel | Hosting, edge delivery, logging | Global edge network |

---

By using the Service, the Customer is deemed to have agreed to this DPA. A countersigned copy is available on request from **privacy@shahojai.com**.
