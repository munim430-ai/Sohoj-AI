# Security Policy

The ShahojAI team takes the security of our platform and our customers' data seriously. This document describes how to report a vulnerability, which versions we support, and what to expect when you contact us.

## Reporting a vulnerability

If you believe you have found a security vulnerability in ShahojAI, please report it to us privately. **Do not** open a public GitHub issue, discuss it on social media, or disclose it to third parties before we have had a chance to address it.

- **Email:** security@shahojai.com
- **Subject line:** `[SECURITY]` followed by a short description
- **PGP:** A public key is available on request if you wish to encrypt your report.

Please include, where possible:

- A clear description of the issue and its potential impact.
- Steps to reproduce, including any proof-of-concept code, requests, or screenshots.
- The affected component, endpoint, or page, and the version or commit if known.
- Your assessment of severity and any suggested remediation.

If a report concerns customer data exposure or cross-tenant access, mark it as **critical** in the subject line so we can prioritise it.

## Our commitment and response SLA

We aim to handle every report promptly and transparently. Our target timelines are:

| Stage | Target |
| --- | --- |
| Acknowledgement of report | Within **2 business days** |
| Initial triage and severity assessment | Within **5 business days** |
| Status update cadence | At least every **7 days** until resolved |
| Fix for **critical** vulnerabilities | Within **14 days** of confirmation |
| Fix for **high** vulnerabilities | Within **30 days** of confirmation |
| Fix for **medium / low** vulnerabilities | Next scheduled release, typically within **90 days** |

Severity is assessed using CVSS v3.1 as a guideline, with additional weight given to issues affecting multi-tenant isolation, authentication, payment integrity, or personal data.

## Supported versions

ShahojAI is a continuously deployed SaaS application. The hosted production environment always runs the latest release and is the only version that receives security fixes. For the self-managed and source distributions, the following versions are supported with security updates:

| Version | Supported |
| --- | --- |
| 1.0.x | ✅ Supported |
| < 1.0 (pre-release) | ❌ Not supported |

We recommend always running the latest released version. Security fixes are not back-ported to unsupported versions.

## Scope

**In scope:**

- The ShahojAI web application and dashboard.
- The public APIs and the embeddable chat widget.
- Authentication, session management, and multi-tenant isolation (Supabase row-level security).
- Billing and aamarPay webhook handling.
- Handling of FAQ documents, embeddings, and conversation data.

**Out of scope:**

- Vulnerabilities in third-party services we depend on (Supabase, Qdrant, Groq, aamarPay, Vercel) — please report these to the respective vendor, though we appreciate a heads-up.
- Denial-of-service or volumetric testing against production. Do not attempt this.
- Social engineering of our staff, customers, or vendors.
- Reports based solely on automated scanner output without a demonstrable impact.
- Missing best-practice headers or configurations without a concrete exploit.

## Safe harbour

We will not pursue or support legal action against researchers who:

- Act in good faith and within this policy.
- Avoid privacy violations, data destruction, and service disruption.
- Do not access, modify, or retain data belonging to other users beyond the minimum necessary to demonstrate the issue.
- Give us a reasonable opportunity to remediate before any public disclosure.

If you follow this policy, we will treat your research as authorised, work with you to understand and resolve the issue quickly, and recognise your contribution (with your permission) once a fix is released.

## Coordinated disclosure

We practise coordinated disclosure. We ask that you keep the details of any vulnerability confidential until we have released a fix and, where appropriate, notified affected customers. We are happy to credit you in our release notes or a security advisory.

Thank you for helping keep ShahojAI and our customers safe.
