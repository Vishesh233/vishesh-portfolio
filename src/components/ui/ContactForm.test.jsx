import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { site } from '../../data/site.js'
import { ContactForm } from './ContactForm.jsx'

const filled = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello from the tests.',
}

/** Type the three fields and press the submit button. */
async function fillAndSend(user) {
  await user.type(screen.getByLabelText('Name'), filled.name)
  await user.type(screen.getByLabelText('Email'), filled.email)
  await user.type(screen.getByLabelText('Message'), filled.message)
  await user.click(screen.getByRole('button', { name: /send message/i }))
}

describe('ContactForm', () => {
  let fetchMock

  beforeEach(() => {
    vi.stubEnv('VITE_FORMSPREE_ID', 'test-form-id')
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders three labelled fields, a honeypot and a polite live region', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText('Name')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Message')).toBeTruthy()

    const status = screen.getByRole('status')
    expect(status.getAttribute('aria-live')).toBe('polite')

    const honeypot = document.getElementById('contact-gotcha')
    expect(honeypot).toBeTruthy()
    expect(honeypot.getAttribute('tabindex')).toBe('-1')
    expect(honeypot.closest('[aria-hidden="true"]')).toBeTruthy()
  })

  it('shows inline errors, focuses the first invalid field and never fetches', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('Please enter your name.')).toBeTruthy()
    expect(screen.getByText('Please enter your email address.')).toBeTruthy()
    expect(screen.getByText('Please enter a message.')).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByLabelText('Name'))
    expect(screen.getByLabelText('Name').getAttribute('aria-invalid')).toBe('true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a malformed email address inline', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Name'), filled.name)
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Message'), filled.message)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('Please enter a valid email address.')).toBeTruthy()
    expect(screen.getByLabelText('Email').getAttribute('aria-invalid')).toBe('true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends the message and reports success only when the response is ok', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 })
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillAndSend(user)

    await waitFor(() => expect(screen.getByText('Message sent. Thank you!')).toBeTruthy())

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('https://formspree.io/f/test-form-id')
    expect(screen.getByLabelText('Name').value).toBe('')
    expect(screen.getByLabelText('Email').value).toBe('')
    expect(screen.getByLabelText('Message').value).toBe('')
  })

  it('shows the real failure when the server answers with an error status', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'The server could not accept the message.' }),
    })
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillAndSend(user)

    await waitFor(() =>
      expect(screen.getByText('The server could not accept the message.')).toBeTruthy(),
    )
    expect(screen.queryByText('Message sent. Thank you!')).toBeNull()
  })

  it('reports a network failure without claiming success', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillAndSend(user)

    await waitFor(() =>
      expect(screen.getByText(/could not reach the server/i)).toBeTruthy(),
    )
    expect(screen.queryByText('Message sent. Thank you!')).toBeNull()
  })

  it('refuses a filled honeypot before any request leaves the page', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Name'), filled.name)
    await user.type(screen.getByLabelText('Email'), filled.email)
    await user.type(screen.getByLabelText('Message'), filled.message)
    // Scripts reach this field; visitors never do, so setting the value
    // directly stands in for the automation that would fill it.
    const honeypot = document.getElementById('contact-gotcha')
    honeypot.value = 'spam'
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByText('Message sent. Thank you!')).toBeNull()
    expect(screen.getByRole('status').textContent).toMatch(/could not be sent/i)
  })

  it('disables every control while the request is in flight', async () => {
    let resolveFetch
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve
        }),
    )
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillAndSend(user)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /sending/i }).disabled).toBe(true),
    )
    // The fieldset carries `disabled`, which greys out every control inside —
    // the inputs' own `disabled` properties stay false by design.
    const fieldset = document.querySelector('form fieldset')
    expect(fieldset.disabled).toBe(true)

    resolveFetch({ ok: true, status: 200 })

    await waitFor(() => expect(screen.getByText('Message sent. Thank you!')).toBeTruthy())
    expect(screen.getByRole('button', { name: /send message/i }).disabled).toBe(false)
    expect(fieldset.disabled).toBe(false)
  })

  it('keeps the honeypot out of the keyboard tab order', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.tab()
    expect(document.activeElement).toBe(screen.getByLabelText('Name'))
    await user.tab()
    expect(document.activeElement).toBe(screen.getByLabelText('Email'))
    await user.tab()
    expect(document.activeElement).toBe(screen.getByLabelText('Message'))
    await user.tab()
    // The honeypot sits between the message and the button in the DOM but is
    // not reachable, so focus lands straight on the submit button.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /send message/i }))
  })

  it('replaces the form with an inline notice and a mailto link when no id is set', () => {
    vi.stubEnv('VITE_FORMSPREE_ID', '')
    render(<ContactForm />)

    expect(screen.getByText(/not configured/i)).toBeTruthy()

    const mailLink = screen.getByRole('link', { name: site.email })
    expect(mailLink.getAttribute('href')).toBe(`mailto:${site.email}`)

    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByLabelText('Name')).toBeNull()
  })
})