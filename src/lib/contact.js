/**
 * Contact form logic.
 *
 * WHY THIS LIVES OUTSIDE THE COMPONENT
 * Validation and submission are plain data transforms. Keeping them out of the
 * JSX means they can be unit-tested with a mocked fetch and no DOM at all,
 * while the component stays responsible for rendering, focus and status text.
 */

/**
 * Deliberately permissive: one @, one dot, no spaces. Anything stricter
 * rejects addresses that genuinely exist.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * The Formspree endpoint for this deployment, or null when the id has not been
 * provided. Read at call time rather than module load so a missing id reaches
 * the UI as a fixable condition instead of being baked in.
 */
export function formspreeEndpoint() {
  const formId = import.meta.env.VITE_FORMSPREE_ID
  return formId ? `https://formspree.io/f/${formId}` : null
}

/**
 * Validate the three user-facing fields.
 *
 * Returns an object keyed by field name holding the first failing message for
 * that field; an empty object means the values are ready to send. Messages are
 * plain strings so the component can pair them with `aria-describedby`.
 */
export function validateContact({ name, email, message }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Please enter your name.'
  }

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!message.trim()) {
    errors.message = 'Please enter a message.'
  }

  return errors
}

/**
 * POST the message to Formspree.
 *
 * Success is reported only when the response itself says so: a non-2xx status
 * or a network failure comes back as `{ ok: false, message }` with text that is
 * safe to show a visitor, and the raw error is kept in the console for
 * debugging. The honeypot is forwarded as Formspree's `_gotcha`, which the
 * server discards rather than delivers.
 */
export async function sendContact(values, endpoint, fetchImpl = globalThis.fetch) {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
    _gotcha: values.honeypot ?? '',
  }

  let response
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (cause) {
    console.error('[contact] network failure', cause)
    return {
      ok: false,
      message: 'Could not reach the server. Check your connection and try again, or email me directly.',
    }
  }

  if (!response.ok) {
    let detail = null
    try {
      const data = await response.json()
      detail = data?.error ?? null
    } catch {
      // Formspree can answer non-JSON; the status alone explains the failure.
    }
    console.error('[contact] Formspree responded', response.status, detail ?? '')
    return {
      ok: false,
      message: detail ?? `The server responded with ${response.status}. Please email me directly instead.`,
    }
  }

  return { ok: true }
}