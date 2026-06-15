# Pricing and Plan Limits

This document is the single source of truth for the product's commercial plans. The product name is temporary and will be finalized later; these limits remain fixed unless the product owner explicitly changes them.

## Plan summary

| Feature | Free | Basic | Pro |
|---|---:|---:|---:|
| Monthly price | ৳0 | ৳1,999 | ৳4,999 |
| Facebook Pages | 1 | 1 | 5 |
| Active sales conversations | 10/month | 500/month | 5,000/month |
| Products | 5 | 200 | Unlimited |
| Monitored Facebook posts | 3 | Unlimited | Unlimited |
| Team members | 1 | 2 | 5 |
| Comment-to-Order | Limited | Full | Advanced |
| Abandoned-sales recovery | 5/month | 300/month | Advanced sequences |
| Human takeover | Basic | Shared inbox | Team routing |
| Lead pipeline | Basic | Full | Custom stages |
| Google Sheets import/export | No | Yes | Yes |
| Revenue analytics | Basic | Full | Advanced |
| Conversation history | 30 days | 90 days | Extended |
| bKash tracker | No | 1 Android device | Up to 3 Android devices |
| bKash transactions | No | 3,000/month | 15,000/month |
| Product branding | Required | Removed | Removed |
| Dashboard advertisements | Yes | No | No |
| API and webhooks | No | No | No |

## Free

The Free plan is a restricted product trial intended to prove the product's value.

- 1 Facebook Page
- 10 active sales conversations per month
- 5 products
- Monitor up to 3 Facebook posts
- Bangla, Banglish, and English replies
- Basic purchase-intent detection
- Limited Comment-to-Order flow
- 5 abandoned-sales recoveries per month
- Draft order creation
- Manual order confirmation
- Basic human takeover
- 1 user
- 30-day conversation history
- Basic lead, order, and recovery statistics
- Product branding remains visible
- Advertisements may appear inside the dashboard
- No bKash tracker
- No Google Sheets integration
- No API or webhooks

## Basic — ৳1,999/month

The Basic plan is for solo sellers and small Facebook businesses.

- 1 Facebook Page
- 500 active sales conversations per month
- 200 products
- Unlimited monitored posts
- Full Comment-to-Order automation
- Up to 300 abandoned-sales recovery sequences per month
- Structured order-information collection
- Draft and confirmed orders
- Configurable follow-up delays
- Business-hours controls
- Customer opt-out controls
- AI confidence controls
- Human takeover and shared inbox
- 2 users
- Full lead pipeline
- Google Sheets product import
- Google Sheets and CSV order export
- Full revenue and conversion analytics
- 90-day history
- No product branding
- No dashboard advertisements
- No API or webhooks

### Basic bKash module

- 1 connected Android device
- Up to 3,000 transactions per month
- Automatic detection from the approved Android companion workflow
- Cash In
- Cash Out
- Send Money sent
- Send Money received
- Merchant Payment
- Fees
- Daily, weekly, and monthly summaries
- Search by amount, number, type, or date
- Custom transaction tags
- CSV export

## Pro — ৳4,999/month

The Pro plan is for established businesses operating several Facebook Pages or a sales team.

- Up to 5 Facebook Pages
- 5,000 active sales conversations per month
- Unlimited products
- Unlimited monitored posts
- Up to 5 team members
- Advanced Comment-to-Order automation
- Advanced abandoned-sales recovery sequences
- Shared team inbox
- Conversation and lead assignment
- Custom pipeline stages
- Internal notes
- High-value lead detection
- Advanced human-handover rules
- Discount and offer approval controls
- Returning-customer recognition
- Customer segmentation
- Product bundle recommendations
- Advanced automation rules
- Google Sheets workflows
- Advanced revenue attribution and funnel analytics
- Extended history
- Priority support
- No product branding
- No dashboard advertisements
- No API or webhooks

### Pro bKash module

- Up to 3 connected Android devices
- Multiple bKash numbers
- Up to 15,000 transactions per month
- Combined money-movement dashboard
- Automatic transaction categorization
- Duplicate transaction warnings
- Unusually large transaction alerts
- Daily, weekly, and monthly reporting
- CSV and PDF export
- Team access controls

## Billing rules

### Active sales conversation

One active sales conversation means one unique customer who communicates with a connected business during the billing month. Multiple messages from the same customer during that month count as one active sales conversation.

### Usage controls

The system must notify account owners when usage reaches:

- 70% of the monthly limit
- 90% of the monthly limit
- 100% of the monthly limit

There will be no automatic overage billing at launch. When the limit is reached, the business must wait for the next billing period or upgrade its plan.

### Plan enforcement

Plan limits must be enforced per organization and billing period. Downgrades must not delete customer data immediately; access to over-limit resources should be restricted according to the retention policy.

## Implementation note

The existing proof-of-concept code may still contain the previous Starter/Pro/Enterprise credit-based model. That legacy model is obsolete. Application code, database enums, billing pages, payment handling, and usage enforcement must be migrated to the Free/Basic/Pro specification in this document.