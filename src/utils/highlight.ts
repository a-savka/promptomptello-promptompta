export interface TokenRule {
  pattern: RegExp
  className: string
}

export const TOKEN_RULES: TokenRule[] = [
  { pattern: /`[^`]+`/,                 className: 'token-inline-code' },
  { pattern: /"[^"]*"\s*:/,              className: 'token-json-key' },
  { pattern: /"[^"]*"/,                  className: 'token-json-string' },
  { pattern: /\{\{\s*\w+\s*\}\}/,        className: 'token-variable' },
  { pattern: /<\/?\w+[^>]*>/,            className: 'token-xml-tag' },
  { pattern: /^## .+/m,                  className: 'token-header' },
  { pattern: /\+\+\+\w+/,                className: 'token-decorator' },
  { pattern: /—{2,}/,                    className: 'token-separator' },
  { pattern: /→/,                        className: 'token-arrow' },
  { pattern: /[∈∩∪¬⊕]/,                 className: 'token-metaglyph' },
  { pattern: /\b[A-ZА-Я]{3,}\b/,         className: 'token-accent' },
]

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function highlightText(text: string): string {
  if (!text) return ''

  const result: string[] = []
  let i = 0

  while (i < text.length) {
    let bestMatchLength = 0
    let bestClassName = ''

    for (const rule of TOKEN_RULES) {
      const sliced = text.slice(i)
      const match = sliced.match(rule.pattern)
      if (match && match.index === 0 && match[0].length > bestMatchLength) {
        bestMatchLength = match[0].length
        bestClassName = rule.className
      }
    }

    if (bestClassName) {
      const matched = text.slice(i, i + bestMatchLength)
      result.push(`<span class="${bestClassName}">${escapeHtml(matched)}</span>`)
      i += bestMatchLength
    } else {
      result.push(escapeHtml(text[i]))
      i++
    }
  }

  return result.join('')
}
