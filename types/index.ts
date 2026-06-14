export type SubscriptionTier = 'starter' | 'pro' | 'enterprise'

export interface Organization {
  id: string
  name: string
  slug: string
  owner_id: string
  subscription_tier: SubscriptionTier
  credit_balance: number
  custom_domain: string | null
  branding: {
    logo_url: string | null
    primary_color: string
    company_name: string | null
    show_powered_by: boolean
  }
  billing_period_start: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  auth_id: string
  organization_id: string
  email: string
  role: 'owner' | 'admin'
  created_at: string
}

export interface Conversation {
  id: string
  organization_id: string
  user_id: string | null
  user_message: string
  ai_response: string | null
  tokens_used: number
  language: 'en' | 'bn'
  created_at: string
}

export interface FAQDocument {
  id: string
  organization_id: string
  file_name: string
  file_size: number | null
  chunk_count: number
  uploaded_at: string
  created_at: string
}

export interface Payment {
  id: string
  organization_id: string
  amount: number
  currency: 'BDT' | 'USD'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  aamarpay_txn_id: string | null
  credits_purchased: number | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AuthContextType {
  user: any | null
  organization: Organization | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
