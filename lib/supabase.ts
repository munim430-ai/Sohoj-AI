import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          subscription_tier: 'starter' | 'pro' | 'enterprise'
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
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['organizations']['Row']>
      }
      users: {
        Row: {
          id: string
          auth_id: string
          organization_id: string
          email: string
          role: 'owner' | 'admin'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      conversations: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          user_message: string
          ai_response: string | null
          tokens_used: number
          language: 'en' | 'bn'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Row']>
      }
      faq_documents: {
        Row: {
          id: string
          organization_id: string
          file_name: string
          file_size: number | null
          chunk_count: number
          uploaded_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['faq_documents']['Row'], 'id' | 'uploaded_at' | 'created_at'>
        Update: Partial<Database['public']['Tables']['faq_documents']['Row']>
      }
      payments: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['payments']['Row']>
      }
    }
  }
}
