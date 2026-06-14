export function detectLanguage(text: string): 'en' | 'bn' {
  // Simple Bengali detection based on Unicode ranges
  // Bengali characters: U+0980 to U+09FF
  const bengaliRegex = /[ঀ-৿]/g
  const bengaliChars = (text.match(bengaliRegex) || []).length
  const totalChars = text.length

  // If more than 20% of characters are Bengali, classify as Bengali
  if (bengaliChars / totalChars > 0.2) {
    return 'bn'
  }
  return 'en'
}

export function translate(text: string, targetLang: 'en' | 'bn'): string {
  // In production, use Google Translate API or other translation service
  // For now, return as-is
  return text
}
