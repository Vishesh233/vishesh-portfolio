import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site.js'
import { formspreeEndpoint, sendContact, validateContact } from '../../lib/contact.js'
import { ArrowIcon } from './Icons.jsx'

/**
 * The contact form: three labelled fields and one live status line.
 *
 * WHY SUBMISSION IS NEVER OPTIMISTIC
 * Formspree can reject a message for reasons the visitor cannot see — a bad
 * id, a rate limit, being offline — so `success` is set only after the
 * response itself says so. Until then the status region reports `sending` or
 * the real failure, and the direct email link beside the form is the channel
 * that cannot fail.
 *
 * HONEYPOT
 * `_gotcha` is Formspree's own honeypot: a hidden, out-of-tab-order field
 * that scripts fill in and humans never reach. A non-empty value is refused
 * before any request leaves the page, so a bot learns nothing about what
 * tripped it.
 */

/** One border treatment, with the invalid state as the only variation. */
function fieldClass(isInvalid) {
  return [
    'w-full rounded-sm border bg-background px-3.5 py-2.5 text-body-sm text-foreground-strong',
    'placeholder:text-subtle transition-colors duration-200',
    isInvalid ? 'border-accent-ink' : 'border-border',
  ].join(' ')
}

export function ContactForm() {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [failure, setFailure] = useState('')

  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  // A response landing after unmount must not call setState on a dead tree.
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Read per render, so a missing id is reported rather than baked in.
  const endpoint = formspreeEndpoint()

  if (!endpoint) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-body-sm text-muted">
          The contact form is not configured for this deployment — no Formspree
          form id is set. Email reaches me directly instead:
        </p>
        <a
          href={`mailto:${site.email}`}
          className="font-mono text-caption text-accent-ink hover:underline"
        >
          {site.email}
        </a>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    const form = event.currentTarget
    const values = {
      name: form.elements.namedItem('name').value.trim(),
      email: form.elements.namedItem('email').value.trim(),
      message: form.elements.namedItem('message').value.trim(),
      honeypot: form.elements.namedItem('_gotcha').value,
    }

    const found = validateContact(values)
    setErrors(found)

    if (found.name || found.email || found.message) {
      // Move focus to the first problem so a keyboard user lands on it.
      const firstInvalid = found.name ? nameRef : found.email ? emailRef : messageRef
      firstInvalid.current?.focus()
      setStatus('idle')
      setFailure('')
      return
    }

    if (values.honeypot) {
      setStatus('error')
      setFailure('Your message could not be sent. Please email me directly instead.')
      return
    }

    setStatus('sending')
    setFailure('')

    const result = await sendContact(values, endpoint)
    if (!mountedRef.current) return

    if (result.ok) {
      form.reset()
      setErrors({})
      setStatus('success')
    } else {
      setStatus('error')
      setFailure(result.message)
    }
  }

  const statusText = {
    sending: 'Sending your message…',
    success: 'Message sent. Thank you!',
    error: failure,
  }[status]

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <fieldset
        disabled={status === 'sending'}
        className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0"
      >
        <legend className="sr-only">Send a message</legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="font-mono text-caption text-muted-strong">
            Name
          </label>
          <input
            ref={nameRef}
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={fieldClass(errors.name)}
          />
          {errors.name && (
            <p id="contact-name-error" className="font-mono text-caption text-accent-ink">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="font-mono text-caption text-muted-strong">
            Email
          </label>
          <input
            ref={emailRef}
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={fieldClass(errors.email)}
          />
          {errors.email && (
            <p id="contact-email-error" className="font-mono text-caption text-accent-ink">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className="font-mono text-caption text-muted-strong">
            Message
          </label>
          <textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            rows={6}
            placeholder="What would you like to talk about?"
            required
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={fieldClass(errors.message)}
          />
          {errors.message && (
            <p id="contact-message-error" className="font-mono text-caption text-accent-ink">
              {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot: off-screen, unfocusable, invisible to assistive tech. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-gotcha">Leave this field empty</label>
          <input id="contact-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex w-fit items-center gap-2 rounded-sm bg-accent px-5 py-3 font-mono text-caption text-accent-on transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send Message'}
          <ArrowIcon className="size-4" />
        </button>

        {/* Always rendered: a live region has to exist before it changes. */}
        <p
          role="status"
          aria-live="polite"
          className={[
            'min-h-5 font-mono text-caption',
            status === 'success' ? 'text-teal-ink' : '',
            status === 'error' ? 'text-accent-ink' : 'text-muted',
          ].join(' ')}
        >
          {statusText}
        </p>
      </div>
    </form>
  )
}