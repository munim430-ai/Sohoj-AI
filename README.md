# ShahojAI - AI Customer Support Agent for Bangladeshi E-commerce

A complete, production-ready SaaS application for AI-powered customer support tailored for Bangladeshi e-commerce sellers.

## Features

- **Multi-tenant Architecture**: Separate isolated environments for each organization
- **AI-Powered RAG Agent**: Retrieval Augmented Generation with Qdrant vector database
- **White-Label Support**: Customizable branding, colors, logos for each tenant
- **Custom Domain Support**: Enterprise tier can use their own domains
- **Credit-Based Pricing**: Flexible billing with monthly credits and purchase options
- **aamarPay Integration**: BDT payment processing for Bangladeshi market
- **Embeddable Widget**: Drop-in chat widget for customer websites
- **Multi-language Support**: Bengali and English support with automatic detection
- **Document Upload**: Support for CSV and PDF FAQ uploads

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL) + Auth
- **Vector DB**: Qdrant for embeddings and semantic search
- **LLM**: OpenAI GPT-3.5-turbo
- **Embeddings**: OpenAI text-embedding-3-small
- **Payments**: aamarPay
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier available)
- Qdrant account (free tier available)
- OpenAI API key
- aamarPay merchant account

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
# Fill in your credentials in .env.local
```

### 3. Supabase Setup
- Create a new Supabase project
- Run the migration from `supabase/migrations/001_init.sql`
- Enable Email and Google OAuth in Auth providers

### 4. Qdrant Setup
```bash
# Local development with Docker
docker run -p 6333:6333 qdrant/qdrant

# Or use Qdrant Cloud (recommended for production)
```

### 5. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
QDRANT_URL=https://your-qdrant-instance.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key
OPENAI_API_KEY=sk-...
AAMARPAY_STORE_ID=your_store_id
AAMARPAY_SIGNATURE_KEY=your_signature_key
AAMARPAY_SANDBOX=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WIDGET_URL=http://localhost:3000
```

## Project Structure

```
shahojAI/
├── app/
│   ├── (auth)/              # Login & signup pages
│   ├── (app)/               # Protected app pages
│   ├── (embed)/             # Embeddable widget
│   ├── api/                 # API routes
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── supabase.ts          # Supabase client & types
│   ├── qdrant.ts            # Qdrant vector DB client
│   ├── embeddings.ts        # OpenAI embeddings
│   ├── language.ts          # Language detection
│   ├── auth.ts              # Auth utilities
│   ├── rag.ts               # RAG logic
│   └── payment.ts           # aamarPay integration
├── types/
│   └── index.ts             # TypeScript types
├── public/
│   └── widget.js            # Embeddable widget script
├── supabase/
│   └── migrations/
│       └── 001_init.sql     # Database schema & RLS
├── middleware.ts            # Custom domain resolution
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Core Features

### 1. Multi-Tenancy
- Each organization has isolated Qdrant collection
- Row-level security (RLS) in Supabase
- Custom domain support for Enterprise tier
- Separate credit balances per org

### 2. RAG (Retrieval Augmented Generation)
- Upload FAQ documents (CSV/PDF)
- Automatic text chunking (500-char chunks with overlap)
- OpenAI embeddings for semantic search
- Top-3 relevant chunks retrieved per query
- Context-aware response generation using GPT-3.5-turbo

### 3. Billing & Credits
- Monthly credit allocation per plan
- Pay-as-you-go additional credit packs
- Plans:
  - Starter: 500 credits/month - ৳2,500
  - Pro: 2000 credits/month - ৳8,000
  - Enterprise: Unlimited
- Automatic monthly resets
- aamarPay webhook verification

### 4. White-Labeling
- Customizable logo, company name, primary color
- Optional "Powered by ShahojAI" badge
- Custom domain support (Enterprise)
- Branding stored as JSON in org table

### 5. Embeddable Widget
- Single script tag to embed chat
- White-labeled with org branding
- Real-time messaging
- Server-sent events for streaming
- Responsive design

## API Endpoints

### Chat
- `POST /api/chat` - Send message and get AI response
  - Input: `{ message, organizationId }`
  - Output: Server-sent events stream

### Documents
- `POST /api/upload-faq` - Upload FAQ documents
  - Supports: CSV, PDF
  - Auto-chunks and embeds content

### Organization
- `GET /api/organization` - Fetch current org (auth required)
- `PUT /api/organization` - Update branding/settings

### Payments
- `POST /api/create-checkout` - Initiate aamarPay checkout
- `POST /api/payment-webhook` - aamarPay callback
- `GET /api/payment-webhook` - Fallback webhook handler

## Pages

### Authentication
- `/login` - Email/password login with Google OAuth
- `/signup` - Create account and organization
- `/onboard` - Auto-setup organization

### Application
- `/dashboard` - Overview, stats, quick actions
- `/chat` - Full chat interface with message history
- `/settings` - Org name, branding, document uploads
- `/billing` - Plans, credit purchase, usage

### Widget
- `/(embed)/widget` - Embedded chat interface (iframe)

## Embedding the Widget

Add this script to any website:

```html
<script 
  src="https://shahojAI.com/widget.js" 
  data-org-id="YOUR_ORG_ID">
</script>
```

The widget appears as a fixed chat button in bottom-right corner.

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial ShahojAI commit"
git push origin main
```

### 2. Create Vercel Project
```bash
npm install -g vercel
vercel
```

### 3. Add Environment Variables
In Vercel Project Settings > Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
QDRANT_URL
QDRANT_API_KEY
OPENAI_API_KEY
AAMARPAY_STORE_ID
AAMARPAY_SIGNATURE_KEY
AAMARPAY_SANDBOX=false
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_WIDGET_URL=https://your-domain.vercel.app
```

### 4. Deploy
```bash
vercel --prod
```

## Database Schema

### organizations
- id, name, slug (unique), owner_id
- subscription_tier (starter/pro/enterprise)
- credit_balance, billing_period_start
- custom_domain (nullable, Enterprise only)
- branding (JSON): logo_url, primary_color, company_name, show_powered_by

### users
- id, auth_id, organization_id, email, role (owner/admin)

### conversations
- id, organization_id, user_message, ai_response
- tokens_used, language (en/bn), created_at

### faq_documents
- id, organization_id, file_name, chunk_count

### payments
- id, organization_id, amount, currency (BDT)
- status (pending/completed/failed), aamarpay_txn_id
- credits_purchased, created_at

### vector_chunks
- id, organization_id, document_id, chunk_text
- qdrant_point_id (for metadata storage)

## Security

- **Auth**: Supabase Auth with JWT sessions
- **Multi-tenancy**: RLS policies for data isolation
- **Payment**: aamarPay signature verification (MD5)
- **API**: Organization ownership validation
- **Data**: Encrypted in transit (HTTPS)

## Monitoring

Monitor these metrics:
- API response times (target: <500ms)
- Vector search latency (target: <100ms)
- Payment webhook success (target: >99.9%)
- Error rates and types

## Troubleshooting

**"Organization not found"**
- Check users table has auth_id
- Verify signup completed

**"Insufficient credits"**
- Check credit_balance in orgs table
- Verify payment webhook processed

**"Vector search returns empty"**
- Verify documents uploaded successfully
- Check Qdrant collection exists
- Ensure embeddings created

**"Widget not loading"**
- Verify org_id in script tag
- Check CORS headers
- Check browser console for errors

## Next Steps

1. Set up Supabase project and database
2. Configure Qdrant instance
3. Get OpenAI and aamarPay API keys
4. Deploy to Vercel
5. Test payment flow in sandbox
6. Onboard first customer
7. Monitor metrics and optimize

## Support

For issues, create a GitHub issue or email: info@shahojAI.com

## License

MIT