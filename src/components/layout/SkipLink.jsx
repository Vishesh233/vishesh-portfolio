/**
 * Keyboard-accessible skip link.
 *
 * The first focusable element on the page. Visually hidden until focused, at
 * which point it animates in from the top-left. Required for anyone
 * navigating by keyboard across a page that will be this long.
 */
export function SkipLink({ href = '#main', children = 'Skip to content' }) {
  return (
    <a href={href} className="skip-link">
      {children}
    </a>
  )
}