'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

interface Organization {
  id: string
  name: string
  slug: string
  subscription_tier: string
  custom_domain: string | null
  branding: {
    logo_url: string | null
    primary_color: string
    company_name: string | null
    show_powered_by: boolean
  }
}

function SettingsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState(searchParams.get('tab') || 'general')
  const [form, setForm] = useState({
    name: '',
    customDomain: '',
    logoUrl: '',
    primaryColor: '#3b82f6',
    companyName: '',
    showPoweredBy: true,
  })

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data: userData } = await supabase
          .from('users')
          .select('organization_id')
          .eq('auth_id', user.id)
          .single()

        if (!userData) {
          router.push('/onboard')
          return
        }

        const { data: orgData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', userData.organization_id)
          .single()

        if (orgData) {
          setOrganization(orgData)
          setForm({
            name: orgData.name,
            customDomain: orgData.custom_domain || '',
            logoUrl: orgData.branding.logo_url || '',
            primaryColor: orgData.branding.primary_color || '#3b82f6',
            companyName: orgData.branding.company_name || '',
            showPoweredBy: orgData.branding.show_powered_by ?? true,
          })
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrganization()
  }, [router])

  const handleSave = async () => {
    if (!organization) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: form.name,
          custom_domain: form.customDomain || null,
          branding: {
            logo_url: form.logoUrl || null,
            primary_color: form.primaryColor,
            company_name: form.companyName || null,
            show_powered_by: form.showPoweredBy,
          },
        })
        .eq('id', organization.id)

      if (error) throw error

      setOrganization({
        ...organization,
        name: form.name,
        custom_domain: form.customDomain || null,
        branding: {
          logo_url: form.logoUrl || null,
          primary_color: form.primaryColor,
          company_name: form.companyName || null,
          show_powered_by: form.showPoweredBy,
        },
      })

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !organization) return

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('organizationId', organization.id)

      const response = await fetch('/api/upload-faq', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      alert('Document uploaded successfully!')
      e.target.value = ''
    } catch (error: any) {
      console.error('Error uploading document:', error)
      alert(error.message || 'Failed to upload document')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setTab('general')}
            className={`px-4 py-2 font-semibold ${
              tab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setTab('branding')}
            className={`px-4 py-2 font-semibold ${
              tab === 'branding'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Branding
          </button>
          <button
            onClick={() => setTab('documents')}
            className={`px-4 py-2 font-semibold ${
              tab === 'documents'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Documents
          </button>
        </div>

        {tab === 'general' && organization && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">General Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>

              {organization.subscription_tier === 'enterprise' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    value={form.customDomain}
                    onChange={(e) => setForm({ ...form, customDomain: e.target.value })}
                    placeholder="support.example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    CNAME: support.example.com → *.shahojAI.com
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'branding' && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Branding</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name (for white-label)
                </label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Your Company"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    className="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.showPoweredBy}
                  onChange={(e) => setForm({ ...form, showPoweredBy: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show "Powered by ShahojAI"
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Knowledge Base</h2>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="file"
                accept=".csv,.pdf"
                onChange={handleDocumentUpload}
                disabled={saving}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Upload FAQ Document</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">CSV or PDF files</p>
              </label>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uploaded Documents</h3>
              <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  )
}
