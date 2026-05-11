import { describe, it, expect } from 'vitest'
import { highlightText, TOKEN_RULES } from 'src/utils/highlight'

describe('highlightText', () => {
  it('returns empty string for empty input', () => {
    expect(highlightText('')).toBe('')
  })

  it('highlights XML tags', () => {
    const result = highlightText('<div>hello</div>')
    expect(result).toContain('token-xml-tag')
    expect(result).toContain('&lt;div&gt;')
    expect(result).toContain('&lt;/div&gt;')
  })

  it('highlights variables', () => {
    const result = highlightText('Hello {{name}}')
    expect(result).toContain('token-variable')
    expect(result).toContain('{{name}}')
  })

  it('highlights headers', () => {
    const result = highlightText('## Title')
    expect(result).toContain('token-header')
  })

  it('escapes HTML characters', () => {
    const result = highlightText('<b>test</b>')
    expect(result).toContain('&lt;b&gt;')
    expect(result).toContain('&lt;/b&gt;')
  })
})
