import { supabase, supabaseAdmin } from './supabase'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return data.user
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return null
  }

  return data.session
}

export async function getUserOrganization(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('organization_id')
    .eq('auth_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user organization:', error)
    return null
  }

  return data?.organization_id
}

export async function getOrganization(orgId: string) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  if (error) {
    console.error('Error fetching organization:', error)
    return null
  }

  return data
}

export async function createOrganization(ownerId: string, name: string, slug: string) {
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      owner_id: ownerId,
      name,
      slug,
      subscription_tier: 'starter',
      credit_balance: 500,
      billing_period_start: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating organization:', error)
    throw error
  }

  // Create user entry
  await supabase.from('users').insert({
    auth_id: ownerId,
    organization_id: data.id,
    email: '',
    role: 'owner',
  })

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
