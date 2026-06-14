# Privacy Policy

**Effective date: 14 June 2026**
**Last updated: June 2026**

ShahojAI Technologies Ltd. ("ShahojAI", "we", "us", or "our") operates the ShahojAI platform (the "Platform"), a multi-tenant, AI-powered customer-support service for e-commerce sellers. This Privacy Policy explains how we collect, use, disclose, and safeguard personal data when you visit our website, create an account, or use the Platform.

This Policy is written to satisfy our obligations under the EU General Data Protection Regulation (Regulation (EU) 2016/679, "GDPR"), the UK GDPR, and applicable Bangladeshi law, including the constitutional right to privacy under Article 43 of the Constitution of the People's Republic of Bangladesh and any data-protection legislation enacted in Bangladesh. Where our customers are located in the European Economic Area ("EEA"), the United Kingdom, or Switzerland, the GDPR-specific provisions of this Policy apply.

Because ShahojAI is a business-to-business ("B2B") service, our relationship with personal data falls into two categories:

- **Account data** — personal data about the businesses and individuals who register for and administer a ShahojAI workspace ("Customers"). For this data we act as a **data controller**.
- **End-customer data** — personal data contained in the chat messages and support content that a Customer's end users send to that Customer's support agent, and which the Customer routes through ShahojAI. For this data we act as a **data processor** on the Customer's behalf. The processing of this data is governed by our [Data Processing Agreement](/dpa), which forms part of our Terms of Service.

## 1. Who we are and how to contact us

ShahojAI Technologies Ltd. is a company registered in Bangladesh and operating from Dhaka. For any privacy question, request, or complaint, contact our privacy team:

- **Email:** privacy@shahojai.com
- **Post:** Data Protection, ShahojAI Technologies Ltd., Dhaka, Bangladesh

We aim to respond to all privacy enquiries within 30 days.

## 2. Personal data we collect

### 2.1 Information you provide to us

- **Identity and account data:** name, business name, email address, phone number, job title, and password (stored only as a salted hash).
- **Organization data:** company name, workspace slug, branding details (logo, brand colours), custom domain, and subscription tier.
- **Billing data:** billing contact, transaction history, invoice records, and the BDT amounts charged. Card and mobile-wallet details are collected and processed directly by our payment processor, aamarPay; we do not store full payment-instrument numbers on our systems.
- **Support and communications:** messages you send to us, support tickets, and survey responses.

### 2.2 Information we collect automatically

- **Usage and telemetry data:** pages viewed, features used, credit consumption, conversation counts, API request metadata, timestamps, and error logs.
- **Device and connection data:** IP address, browser type and version, operating system, language preference, and approximate location derived from IP.
- **Cookies and similar technologies:** see our [Cookie Policy](/cookies).

### 2.3 End-customer content (processed on behalf of Customers)

When a Customer deploys the ShahojAI embeddable widget or agent, end users of that Customer may submit chat messages that contain personal data (for example, names, order numbers, delivery addresses, or phone numbers). ShahojAI receives, stores, embeds, and processes this content **solely to provide the support service to the relevant Customer** and strictly under the Customer's instructions. We do not determine the purposes of this processing and we are not the controller of it.

## 3. How we use personal data and our legal bases

For data where we act as controller, we rely on the following GDPR legal bases:

| Purpose | Categories of data | Legal basis |
| --- | --- | --- |
| Creating and administering your account | Identity, account, organization data | Performance of a contract (Art. 6(1)(b)) |
| Providing and operating the Platform | Account, usage, organization data | Performance of a contract (Art. 6(1)(b)) |
| Processing payments and managing credits | Billing data | Performance of a contract (Art. 6(1)(b)); legal obligation (Art. 6(1)(c)) |
| Securing the Platform and preventing abuse | Usage, device, log data | Legitimate interests (Art. 6(1)(f)) |
| Improving and developing features | Aggregated and pseudonymised usage data | Legitimate interests (Art. 6(1)(f)) |
| Sending service and transactional emails | Identity, account data | Performance of a contract (Art. 6(1)(b)) |
| Sending marketing communications | Identity, account data | Consent (Art. 6(1)(a)), withdrawable at any time |
| Complying with legal, tax, and accounting duties | Billing, account data | Legal obligation (Art. 6(1)(c)) |

We do not use end-customer content to train, fine-tune, or improve any general-purpose machine-learning model, and we do not sell personal data.

## 4. Sub-processors

To deliver the Platform we rely on a small number of carefully selected sub-processors. Each is bound by a written agreement that imposes data-protection obligations consistent with this Policy and, where applicable, the GDPR's requirements for processors (Art. 28).

| Sub-processor | Function | Data processed | Location of processing |
| --- | --- | --- | --- |
| **Supabase** | Primary application database, authentication, and storage (PostgreSQL) | Account, organization, billing metadata, conversation records | Singapore / EU regions |
| **Qdrant** | Vector database for retrieval-augmented generation (RAG) embeddings | Vectorised representations of FAQ and support content | EU / cloud region |
| **Groq** | Large-language-model inference for generating support responses | Chat prompts and retrieved context (transient) | United States |
| **aamarPay** | Payment processing in BDT | Billing and transaction data | Bangladesh |
| **Vercel** | Application hosting, edge network, and content delivery | Request metadata, IP addresses, logs | Global edge network |

A current list of sub-processors is available on request from privacy@shahojai.com. We will give Customers reasonable prior notice of any intended addition or replacement of a sub-processor that processes end-customer content, allowing the Customer to object as described in our [Data Processing Agreement](/dpa).

## 5. International data transfers

ShahojAI operates from Bangladesh, and several of our sub-processors process data outside the country, including in the United States and the EEA. Where we transfer personal data originating in the EEA, the UK, or Switzerland to a country that has not received an adequacy decision, we rely on appropriate safeguards under Chapter V of the GDPR, principally the European Commission's Standard Contractual Clauses (2021/914) supplemented by the UK Addendum where required, together with transfer-impact assessments and additional technical measures such as encryption in transit and at rest.

## 6. Data retention

We retain personal data only for as long as necessary for the purposes set out in this Policy:

- **Account data** is retained for the life of your account and for up to **90 days** after account closure, after which it is deleted or irreversibly anonymised, except where a longer period is required by law.
- **Conversation and end-customer content** is retained according to the retention period configured by the Customer in their workspace. By default, conversation records are retained for **12 months**, after which they are deleted. Customers may shorten this period or request earlier deletion at any time.
- **Vector embeddings** in Qdrant persist for as long as the underlying FAQ documents remain in the workspace; deleting a document removes its associated embeddings.
- **Billing and tax records** are retained for **6 years** to meet Bangladeshi accounting and tax-record obligations.
- **Security and audit logs** are retained for up to **12 months**.

## 7. Your rights

Depending on your location and the applicable law, you may have the following rights in respect of personal data for which we are the controller:

- **Access** — to obtain a copy of the personal data we hold about you.
- **Rectification** — to correct inaccurate or incomplete data.
- **Erasure** — to request deletion of your data ("right to be forgotten").
- **Restriction** — to limit how we process your data in certain circumstances.
- **Portability** — to receive your data in a structured, machine-readable format.
- **Objection** — to object to processing based on legitimate interests or to direct marketing.
- **Withdrawal of consent** — where we rely on consent, you may withdraw it at any time without affecting prior processing.
- **Complaint** — to lodge a complaint with a supervisory authority, such as your local EEA Data Protection Authority or the UK Information Commissioner's Office.

To exercise any right, email privacy@shahojai.com. We will verify your identity before acting on a request and respond within 30 days. Where personal data relates to a Customer's end users (data we process, not control), we will refer the request to the relevant Customer, who is the controller, and assist them in responding.

## 8. Security

We implement technical and organisational measures appropriate to the risk, including encryption of data in transit (TLS) and at rest, tenant isolation enforced through PostgreSQL row-level security, strict access controls and least-privilege access for staff, secure credential storage, signature verification on payment webhooks, audit logging, and regular review of our sub-processors. No method of transmission or storage is perfectly secure, but we work continuously to protect your data and to detect and respond to incidents. To report a vulnerability, see our [Security Policy](https://github.com/shahojai) or email security@shahojai.com.

## 9. Children's data

The Platform is a B2B service not directed to children. We do not knowingly collect personal data from anyone under the age of 18. If you believe a child has provided us personal data, contact privacy@shahojai.com and we will delete it.

## 10. Changes to this Policy

We may update this Policy from time to time. When we make material changes, we will notify Customers by email or through the Platform and update the "Last updated" date above. Continued use of the Platform after an update constitutes acceptance of the revised Policy.

## 11. Contact

For any question about this Policy or our data practices, contact our privacy team at **privacy@shahojai.com**.
