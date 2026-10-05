/**
 * Small, dependency-free helpers shared across the app.
 */

/**
 * Joins truthy class name fragments.
 *
 * Intentionally minimal: Tailwind v4 already handles variant conflicts, and
 * conditional composition here is limited to `cond && 'class'` expressions.
 * Adding clsx/tailwind-merge for this would be unnecessary weight.
 */
export function cn(...classes) {
  return classes.flat(Infinity).filter(Boolean).join(' ')
}

/**
 * Reveals an element once it scrolls into view.
 *
 * Deliberately hand-rolled rather than pulled from a library: the portfolio
 * needs exactly one IntersectionObserver behaviour, and the future 3D layer
 * must be able to reuse the same "am I on screen?" signal to pause its render
 * loop when off-screen. Returns an `unobserve` cleanup so callers controlling
 * a canvas can cancel the observation.
 *
 * @param {Element|null} element
 * @param {{ threshold?: number, rootMargin?: string }} [options]
 * @returns {() => void} cleanup function
 */
export function observeVisibility(element, options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = options

  if (!element) return () => {}

  // No IntersectionObserver (or SSR/prerender): assume visible so content is
  // never permanently hidden.
  if (typeof IntersectionObserver === 'undefined') return () => {}

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.dispatchEvent(
          new CustomEvent('visibilitychange', {
            detail: { isVisible: entry.isIntersecting },
          }),
        )
      }
    },
    { threshold, rootMargin },
  )

  observer.observe(element)

  return () => observer.disconnect()
}

/**
 * Formats a year range from optional ISO dates.
 *
 * Returns an em dash when a date is unknown, so a missing end date can never
 * be rendered as a fabricated one.
 */
export function formatDateRange(start, end) {
  const format = (value) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return String(date.getFullYear())
  }

  const from = format(start)
  const to = format(end)

  if (from && to) return `${from} — ${to}`
  if (from) return `${from} — Present`
  return null
}