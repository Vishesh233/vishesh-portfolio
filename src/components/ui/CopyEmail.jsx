import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site.js'
import { AlertIcon, CheckIcon, CopyIcon } from './Icons.jsx'

/**
 * The email address, shown as real text with a copy button beside it.
 *
 * WHY THE ADDRESS IS VISIBLE, NOT JUST AN ICON
 * A mail icon alone hides the one piece of contact information a visitor is
 * most likely to want to take away. Showing it means it can be read, selected,
 * long-pressed and typed by hand, and the copy button is a convenience rather
 * than a requirement.
 *
 * THE CONFIRMATION IS HONEST
 * `status` only becomes 'copied' AFTER `navigator.clipboard.writeText` resolves.
 * A rejected promise sets 'failed' and says so. Nothing optimistically claims
 * a copy that never happened, which matters because the common failure here is
 * a permissions prompt silently denying access — a fake confirmation would leave
 * someone pasting stale clipboard contents believing the address had been
 * copied.
 *
 * The status message is in an `aria-live="polite"` region so a screen reader
 * hears the confirmation without focus ever leaving the button.
 */
export function CopyEmail({ className = '' }) {
  const [status, setStatus] = useState('idle')
  const timeoutRef = useRef(null)

  // Clear any pending reset on unmount, so a late timeout cannot call
  // setState on a component that no longer exists.
  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  /** Returns to idle after a moment, so the state is not permanently stuck. */
  const scheduleReset = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setStatus('idle'), 2400)
  }

  const handleCopy = async () => {
    clearTimeout(timeoutRef.current)

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')

      await navigator.clipboard.writeText(site.email)

      // Reached only when the write genuinely resolved.
      setStatus('copied')
    } catch {
      setStatus('failed')
    }

    scheduleReset()
  }

  const label = {
    idle: 'Copy email address',
    copied: 'Email address copied',
    failed: 'Copy failed. Select the address and copy it manually.',
  }[status]

  return (
    <div className={['flex flex-wrap items-center gap-2', className].filter(Boolean).join(' ')}>
      <a
        href={`mailto:${site.email}`}
        className="rounded-xs font-mono text-caption text-muted-strong transition-colors duration-200 hover:text-accent-ink"
      >
        {site.email}
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        title={label}
        className={[
          'grid size-7 place-items-center rounded-sm border transition-colors duration-200',
          status === 'copied'
            ? 'border-accent text-accent-ink'
            : status === 'failed'
              ? 'border-accent text-accent-ink'
              : 'border-border text-muted hover:border-accent hover:text-accent-ink',
        ].join(' ')}
      >
        {status === 'copied' ? (
          <CheckIcon className="size-3.5" />
        ) : status === 'failed' ? (
          <AlertIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </button>

      {/* Announced without stealing focus. `aria-live` regions must exist in
          the DOM before the message changes, so this is always rendered. */}
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'copied'
          ? 'Email address copied to clipboard'
          : status === 'failed'
            ? 'Could not copy. Select the address and copy it manually.'
            : ''}
      </span>

      {/* Visible confirmation, so the change is not sighted-only. */}
      {status !== 'idle' && (
        <span
          className={[
            'font-mono text-micro',
            status === 'copied' ? 'text-accent-ink' : 'text-accent-ink',
          ].join(' ')}
        >
          {status === 'copied' ? 'Copied' : 'Copy failed'}
        </span>
      )}
    </div>
  )
}