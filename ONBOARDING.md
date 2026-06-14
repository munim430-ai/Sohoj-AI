# ShahojAI — User Onboarding Guide

A step-by-step walkthrough for a new seller, from sign-up to a live AI support agent embedded on your store. Most teams complete this in **under 30 minutes**.

---

## Before you start

You'll need:
- A business email (or a Google account)
- Your FAQ / policy content as a **CSV or plain-text file** (delivery times, returns, sizing, payment methods, etc.)
- Optional: your store's domain, if you want to embed the chat widget

> Tip: Even a simple CSV with two columns — `question, answer` — works great. The more real questions you include, the better the agent answers.

---

## Step 1 — Create your account (2 min)

1. Go to **`/signup`**.
2. Enter your **company name**, **email**, and a **password** (min. 6 characters), or choose **Continue with Google**.
3. Check your inbox and confirm your email.
4. On first sign-in we automatically create your **organization** and put you on the **Starter** plan with **500 free credits**.

**What's an organization?** It's your company's workspace — your knowledge base, branding, billing, and conversations all live inside it. One account owns one organization.

---

## Step 2 — Upload your knowledge base (5 min)

Your agent only answers from *your* content — it won't make things up.

1. Open **Dashboard → Settings → Documents** (or **Quick actions → Upload FAQ**).
2. Drag in a **CSV** or **text** file (max 5 MB).
3. We split it into passages, embed them locally, and index them in your private vector store.
4. You'll see the document and its chunk count once indexing finishes.

**Good source content:**
- Shipping & delivery timelines (inside/outside Dhaka)
- Return & refund policy
- Payment methods (bKash, Nagad, card, COD)
- Sizing, materials, warranty
- Order tracking instructions

You can upload multiple files and add more anytime.

---

## Step 3 — Test your agent (5 min)

1. Go to **Dashboard → Chat**.
2. Ask a real customer question — in **Bangla or English**. For example:
   - "আমার অর্ডার কবে আসবে?"
   - "What's your return policy?"
   - "ঢাকার বাইরে ডেলিভারি চার্জ কত?"
3. The agent detects the language, retrieves the most relevant passages from your knowledge base, and answers in the same language.

**Each answered question uses 1 credit.** If the answer is off, add clearer content to your knowledge base and try again — quality of answers tracks quality of your FAQs.

---

## Step 4 — Make it yours: branding (3 min) — *Pro & Enterprise*

1. Go to **Settings → Branding**.
2. Set your **company name**, **logo URL**, and **primary color**.
3. Toggle **"Powered by ShahojAI"** off if you want a fully white-label widget.
4. Save. Your chat widget instantly reflects the new look.

---

## Step 5 — Embed the widget on your store (5 min)

1. In **Settings**, copy your widget snippet. It looks like:

   ```html
   <script src="https://YOUR-APP-URL/widget.js" data-org-id="YOUR_ORG_ID"></script>
   ```

2. Paste it just before the closing `</body>` tag on your website (Shopify, WooCommerce, custom HTML — anywhere you can add a script).
3. A chat bubble appears in the bottom-right corner, branded to your store.

**Important — allow your domain.** For security, the widget only talks to our API from domains you've approved. Ask us (or set in your environment) to add your store's origin to the widget allow-list, e.g. `https://yourstore.com`. Until then the widget loads but won't send messages cross-origin.

---

## Step 6 — Top up credits & choose a plan (3 min)

1. Go to **Billing**.
2. Review your plan:
   | Plan | Credits / month | Price |
   |------|-----------------|-------|
   | Starter | 500 | ৳2,500 |
   | Pro | 2,000 | ৳8,000 |
   | Enterprise | Unlimited | Custom |
3. Need more mid-month? Buy a **credit pack** (100 / 500 / 1,000 / 5,000) via **aamarPay** (bKash, Nagad, card). Credits are added the moment payment is verified.

**How credits work:** 1 credit ≈ 1 answered conversation turn. When your balance hits zero, new conversations are paused until you top up or upgrade. Enterprise is unlimited.

---

## Step 7 — Go live (Enterprise: custom domain)

- **Standard:** your widget is already live wherever you embedded it.
- **Enterprise custom domain:** in **Settings → General**, set a domain like `support.yourstore.com`, then add a CNAME pointing to our platform. Your branded support experience now runs on your own subdomain.

---

## You're live 🎉

A typical first day:
1. Upload your top 20 FAQs.
2. Test 10 real questions; fix gaps in your content.
3. Embed the widget on your highest-traffic page.
4. Watch conversations roll into your dashboard.

---

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| "Insufficient credits" | Top up in **Billing** or upgrade your plan. |
| Agent says "I don't know" | Add clearer/more specific content to your knowledge base. |
| Widget loads but won't send | Your store's domain isn't on the widget allow-list yet. |
| Wrong language replies | The agent matches the language of the question; rephrase or add bilingual FAQ entries. |
| Google login returns an error | Confirm the OAuth redirect/callback is configured for your deployment URL. |

## Need help?

- FAQ: **`/faq`**
- Contact: **`/contact`** or **hello@shahojai.com**
- Security issues: **security@shahojai.com** (see `SECURITY.md`)
