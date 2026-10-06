import { describe, expect, it, vi } from 'vitest'
import { formspreeEndpoint, sendContact, validateContact } from './contact.js'

const valid = {
  name: '  Ada Lovelace  ',
  email: '  ada@example.com  ',
  message: '  Hello from the tests.  ',
  honeypot: '',
}

describe('validateContact', () => {
  it('accepts fully populated values, whatever the padding', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('requires every field with a message per field', () => {
    const errors = validateContact({ name: '   ', email: '', message: '\n\t ' })

    expect(errors.name).toBe('Please enter your name.')
    expect(errors.email).toBe('Please enter your email address.')
    expect(errors.message).toBe('Please enter a message.')
  })

  it('rejects malformed addresses without rejecting unusual valid ones', () => {
    expect(
      validateContact({ ...valid, email: 'ada@@example' }).email,
    ).toBe('Please enter a valid email address.')

    expect(validateContact({ ...valid, email: 'ada+tag@sub.example.co.uk' })).toEqual({})
  })
})

describe('formspreeEndpoint', () => {
  it('returns null when no form id is configured', () => {
    vi.stubEnv('VITE_FORMSPREE_ID', '')
    expect(formspreeEndpoint()).toBeNull()
  })

  it('builds the Formspree URL from the configured id', () => {
    vi.stubEnv('VITE_FORMSPREE_ID', 'abc123')
    expect(formspreeEndpoint()).toBe('https://formspree.io/f/abc123')
  })
})

describe('sendContact', () => {
  it('POSTs trimmed JSON to the endpoint and reports success on 2xx', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 })

    const result = await sendContact(valid, 'https://formspree.io/f/abc123', fetchImpl)

    expect(result).toEqual({ ok: true })

    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://formspree.io/f/abc123')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')

    const body = JSON.parse(init.body)
    expect(body).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello from the tests.',
      _gotcha: '',
    })
  })

  it('surfaces the server message when the response is not ok', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ error: 'Fill out the form correctly.' }),
    })

    const result = await sendContact(valid, 'endpoint', fetchImpl)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Fill out the form correctly.')
  })

  it('falls back to the status code when the body is not JSON', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not JSON')
      },
    })

    const result = await sendContact(valid, 'endpoint', fetchImpl)

    expect(result.ok).toBe(false)
    expect(result.message).toContain('500')
  })

  it('reports a network failure instead of throwing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await sendContact(valid, 'endpoint', fetchImpl)

    expect(result.ok).toBe(false)
    expect(result.message).toMatch(/could not reach the server/i)
  })
})