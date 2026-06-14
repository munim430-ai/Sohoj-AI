# ShahojAI Setup Guide

Step-by-step instructions to get ShahojAI running locally and deployed to production.

## Prerequisites

- Node.js 18+ (`node -v`)
- npm or yarn
- Git
- A Supabase account (https://supabase.com - free tier available)
- A Qdrant account or local Docker (https://qdrant.tech)
- OpenAI API key (https://platform.openai.com)
- aamarPay merchant account (https://aamarpay.com)

## Phase 1: Local Development (30 minutes)

### 1.1 Clone Repository

```bash
cd your-workspace
git clone <repository-url>
cd shahojAI
npm install
```

### 1.2 Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. Copy the following from Project Settings:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Secret Key → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Create Qdrant Instance

**Option A: Local Development (recommended for testing)**
```bash
# Install Docker first if you haven't
docker run -p 6333:6333 qdrant/qdrant
# Visit http://localhost:6333/dashboard
```

**Option B: Qdrant Cloud (recommended for production)**
1. Go to https://cloud.qdrant.io
2. Create a new cluster
3. Copy API key and cluster URL

### 1.4 Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```
# Supabase (from step 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Qdrant (from step 1.3)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-api-key

# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...

# aamarPay (from merchant account)
AAMARPAY_STORE_ID=your_store_id
AAMARPAY_SIGNATURE_KEY=your_signature_key
AAMARPAY_SANDBOX=true

# Local URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WIDGET_URL=http://localhost:3000
```

### 1.5 Set Up Database

1. Go to Supabase Dashboard > SQL Editor
2. Create new query
3. Copy entire content from `supabase/migrations/001_init.sql`
4. Paste and execute

This creates:
- organizations
- users  
- conversations
- faq_documents
- payments
- vector_chunks
- All indexes and RLS policies

### 1.6 Enable Authentication Providers

In Supabase Dashboard > Authentication > Providers:

1. **Email** (enabled by default)
   - Confirm email: Enable (for production)
   - Allow self-signup: Enable

2. **Google OAuth** (optional but recommended)
   - Create OAuth credentials at https://console.cloud.google.com
   - Add Client ID and Secret
   - Add redirect URL: `http://localhost:3000/auth/callback`

### 1.7 Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

**Test Flow:**
1. Click "Sign up"
2. Create account with email
3. Confirm email (in Supabase Auth tab)
4. Login and create organization
5. Upload FAQ document (CSV or PDF)
6. Start chatting

## Phase 2: Deployment to Vercel (20 minutes)

### 2.1 Push to GitHub

```bash
git add .
git commit -m "Deploy ShahojAI to Vercel"
git push origin main
```

### 2.2 Create Vercel Project

**Option A: Via CLI**
```bash
npm install -g vercel
vercel link
vercel --prod
```

**Option B: Via Web Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New" > "Project"
3. Import from Git repository
4. Select this repository

### 2.3 Add Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables:

Add all variables from `.env.local`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- QDRANT_URL (use Qdrant Cloud URL for production)
- QDRANT_API_KEY
- OPENAI_API_KEY
- AAMARPAY_STORE_ID
- AAMARPAY_SIGNATURE_KEY
- AAMARPAY_SANDBOX=false (for production)
- NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
- NEXT_PUBLIC_WIDGET_URL=https://your-vercel-domain.vercel.app

### 2.4 Deploy

```bash
vercel --prod
```

Or via Vercel Dashboard: Push to `main` branch → auto-deploy

Your app is now live!

## Phase 3: Production Configuration (30 minutes)

### 3.1 Update aamarPay Settings

1. Go to aamarPay merchant dashboard
2. Switch from Sandbox to Production
3. Update `AAMARPAY_SANDBOX=false` in Vercel
4. Update redirect URLs to production domain

### 3.2 Configure Custom Domains (Enterprise)

**For your own domain:**

1. In Vercel Dashboard:
   - Settings > Domains
   - Add custom domain
   - Copy CNAME record

2. In your domain registrar (GoDaddy, Namecheap, etc):
   - Add CNAME record pointing to Vercel

**For customer custom domains:**

1. Customers need to add CNAME:
   ```
   CNAME: support.gadgetghar.com → *.shahojAI.com
   ```

2. You configure in Dashboard > Settings:
   - Enter: `support.gadgetghar.com`
   - System auto-routes traffic via middleware

### 3.3 Configure Email (Optional)

Set up Supabase email templates for auth flows:
1. Supabase > Auth > Email Templates
2. Customize "Magic Link" and "Confirm Signup" emails
3. Add your logo and branding

### 3.4 Set Up Backups

For production database:
1. Supabase Dashboard > Database > Backups
2. Enable automatic daily backups
3. Set retention to 7-14 days

### 3.5 Monitor & Alerts

Set up monitoring:
- Vercel Analytics: Automatically enabled
- Supabase Logs: Monitor in Supabase Dashboard
- Create alert for errors: Use Vercel Edge Functions

## Testing Checklist

### Authentication
- [ ] Signup with email
- [ ] Login with email
- [ ] Google OAuth login (if configured)
- [ ] Logout
- [ ] Password reset flow

### Core Features
- [ ] Upload FAQ (CSV)
- [ ] Upload FAQ (PDF)
- [ ] Send chat message
- [ ] Receive AI response
- [ ] Message history loads

### Billing
- [ ] View credit balance
- [ ] Buy credits (test aamarPay)
- [ ] Credit balance updates after payment
- [ ] Conversation blocks when credits = 0

### Branding
- [ ] Update company name
- [ ] Upload logo
- [ ] Change primary color
- [ ] Toggle "Powered by" badge
- [ ] White-label styling applies in widget

### Widget
- [ ] Embed script on test website
- [ ] Widget loads in iframe
- [ ] Chat works in widget
- [ ] Branding displays correctly

### Multi-tenancy
- [ ] Create 2 test organizations
- [ ] Verify isolated data
- [ ] Verify isolated Qdrant collections
- [ ] Verify RLS prevents cross-org access

## Troubleshooting

### "Organization not found" error
```bash
# Check users table
supabase sql
SELECT * FROM users WHERE auth_id = 'user-id';
```

### Vector search returns empty
```bash
# Verify Qdrant collection exists
curl http://localhost:6333/collections | jq

# Check vector_chunks table
SELECT COUNT(*) FROM vector_chunks WHERE organization_id = 'org-id';
```

### Payment webhook not processing
1. Check aamarPay IPN settings in merchant dashboard
2. Verify webhook URL is accessible from internet
3. Check Supabase logs for errors
4. Test webhook manually: `POST /api/payment-webhook?transactionId=test`

### CORS errors with widget
1. Verify `NEXT_PUBLIC_WIDGET_URL` is correct
2. Check CORS headers in `next.config.js`
3. Widget script domain must match app domain

### Can't upload documents
1. Verify OpenAI API key is valid
2. Check file size (max reasonable: 10MB)
3. Ensure CSV/PDF format is correct
4. Check Qdrant is reachable

## File Structure for Reference

```
shahojAI/
├── .env.example           # Environment template
├── .env.local             # Local variables (don't commit)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
├── vercel.json            # Vercel deployment config
├── middleware.ts          # Domain routing
├── app/
│   ├── (auth)/           # Login/signup pages
│   ├── (app)/            # Protected pages
│   ├── (embed)/          # Widget page
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── lib/
│   ├── supabase.ts       # DB client
│   ├── qdrant.ts         # Vector DB
│   ├── rag.ts            # RAG logic
│   └── payment.ts        # Payments
├── public/
│   └── widget.js         # Embeddable script
└── supabase/
    └── migrations/       # Database schema
```

## Next: Getting Your First Customer

1. **Create test organization** in your deployed app
2. **Upload sample FAQ** (CSV or PDF)
3. **Test chat** with different questions
4. **Copy widget code** from settings
5. **Embed on test website**
6. **Ask customer to try**
7. **Collect feedback** and iterate

## Getting Help

- Check README.md for detailed docs
- Review API routes in app/api/
- Check lib/ for utility functions
- Consult Supabase docs: https://supabase.com/docs
- Qdrant docs: https://qdrant.tech/documentation

Good luck with ShahojAI! 🚀
