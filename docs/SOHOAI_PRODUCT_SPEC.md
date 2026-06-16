# SohoAI Production Build Prompt (Condensed)

## Goal

Build SohoAI as a Facebook Seller Operating System for Bangladeshi SMEs.

Core features:
- Facebook Comment → Order automation
- Messenger inbox management
- Chatwoot-powered shared inbox
- Human takeover
- Abandoned recovery
- Product catalog
- Leads & Orders
- Sales analytics
- Team management

bKash remains a secondary module.

## Rules

- Continue on `production/android-production`
- Keep `main` untouched
- Update PR #4
- No deploy, no merge
- Use mocks if credentials unavailable
- Do not stop early

## Navigation

Home • Inbox • Orders • Products • More

More:
- Leads
- Recoveries
- Analytics
- bKash
- Team
- Billing
- Settings

## Onboarding

- Language (Bangla/English)
- Business profile
- Products
- Policies
- Facebook setup (mock + real scaffold)
- Chatwoot setup
- Recovery rules
- Plan selection

## Chatwoot

Use for:
- Shared inbox
- Conversations
- Contacts
- Assignments
- Labels
- Notes
- Human takeover

## Facebook Flow

Comment → Intent Detection → Messenger → Collect Details → Create Order → Merchant Approval → Revenue Attribution

## Products

Fields:
- Name
- Price
- Variants
- Images
- Stock status

Limits:
- Free: 5
- Basic: 200
- Pro: Unlimited

## Recovery

- Follow-up: 2 hours
- Follow-up: 24 hours
- Track recovered revenue

## Orders

States:
- Draft
- Pending
- Confirmed
- Cancelled
- Completed

## Dashboard

Show:
- Conversations
- Leads
- Orders
- Revenue
- Recoveries
- Usage

## Team Roles

- Owner
- Admin
- Sales Agent
- Support Agent
- Read Only

## Pricing

### Free
- 1 Page
- 10 conversations
- 5 products
- 5 recoveries
- 1 user

### Basic (৳1,999)
- 1 Page
- 500 conversations
- 200 products
- 300 recoveries
- 2 users

### Pro (৳4,999)
- 5 Pages
- 5000 conversations
- Unlimited products
- Advanced recovery
- 5 users

## Database

Entities:
- organizations
- subscriptions
- products
- conversations
- messages
- contacts
- leads
- orders
- recoveries
- chatwoot_mappings
- facebook_pages
- audit_logs
- bkash_transactions

Requirements:
- UUIDs
- RLS
- Tenant isolation
- Idempotency

## Testing

Backend:
- RLS
- API
- Comment-to-order
- Recovery

Android:
- Navigation
- Inbox
- Orders
- Products

E2E:
Comment → Conversation → Order → Recovery

## Completion Criteria

Deliver:
- Onboarding
- Inbox
- Orders
- Products
- Leads
- Recoveries
- Analytics
- Team management
- Billing
- Settings
- bKash module
- Mock Facebook flow
- Chatwoot integration
- Human takeover

Technical gates:
- Builds pass
- Tests pass
- APK installs
- No secrets committed
