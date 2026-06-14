import { detect } from 'franc'

export function detectLanguage(text: string): 'en' | 'bn' {
  const detectedLang = detect(text, { only: ['en', 'ben'] })

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
