import { franc } from 'franc'

export function detectLanguage(text: string): 'en' | 'bn' {
  // franc uses ISO 639-3 codes ('eng', 'ben') and returns a single best match.
  const detectedLang = franc(text, { only: ['eng', 'ben'] })

  if (detectedLang === 'ben') {
    return 'bn'
  }
  return 'en'
}

export function translate(text: string, targetLang: 'en' | 'bn'): string {
  // In production, use Google Translate API or other translation service
  // For now, return as-is
  return text
}
