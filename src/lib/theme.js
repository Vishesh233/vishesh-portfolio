/**
 * Theme control.
 *
 * ONE SOURCE OF TRUTH
 * The active theme is a single attribute on <html>: `data-theme="light"` or
 * `data-theme="dark"`. Every colour token in tokens.css is declared with
 * `light-dark()`, so the browser re-resolves the entire palette from that one
 * attribute. Nothing in React has to re-render or re-bind to change theme,
 * which is why this module is not a context/provider — it is a small imperative
 * API over an attribute that already exists.
 *
 * NO FLASH ON LOAD
 * React mounting happens well after first paint, so a theme applied from an
 * effect would visibly flash the wrong colours. Instead index.html runs a
 * small inline script in <head> that applies the stored/system theme before
 * the first paint. This module reads the same storage key and the same
 * attribute, so the two always agree and React never has to correct the boot
 * value.
 *
 * STORAGE IS WRAPPED IN TRY/CATCH
 * localStorage throws in Safari private browsing, when a site is opened from
 * a `file://` URL in some browsers, and whenever storage is disabled by policy.
 * A theme preference is never important enough to break the page over, so
 * every access degrades to "no stored preference" and the system setting wins.
 */

const STORAGE_KEY = 'vk-theme'

/** Matches the key and attribute used by the inline boot script in index.html. */
const VALID_THEMES = new Set(['light', 'dark'])

/**
 * Reads the stored preference.
 * @returns {'light' | 'dark' | null} null when nothing usable is stored.
 */
function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return VALID_THEMES.has(stored) ? stored : null
  } catch {
    // Storage unavailable (private mode, disabled cookies, file:// origin).
    return null
  }
}

/**
 * Writes the preference.
 * @param {'light' | 'dark'} theme
 */
function writeStoredTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // A failed write only costs persistence across reloads. The applied theme
    // still works for this session, so this is deliberately not fatal.
  }
}

/** The user's OS-level preference, defaulting to light when unknowable. */
function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * The theme currently applied to the document.
 * Reads the attribute rather than React state, so it stays correct even if
 * something outside this module changed the attribute.
 * @returns {'light' | 'dark'}
 */
export function getAppliedTheme() {
  if (typeof document === 'undefined') return 'light'
  const attribute = document.documentElement.getAttribute('data-theme')
  return VALID_THEMES.has(attribute) ? attribute : 'light'
}

/**
 * The theme a visitor should see: stored choice first, system preference
 * second. Same resolution order as the inline boot script.
 * @returns {'light' | 'dark'}
 */
export function resolveInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

/**
 * Applies a theme to the document.
 *
 * @param {'light' | 'dark'} theme
 * @param {{ persist?: boolean }} [options] persist defaults to true; pass false
 *   for a one-off preview that must not overwrite the saved choice.
 */
export function applyTheme(theme, { persist = true } = {}) {
  if (!VALID_THEMES.has(theme)) return

  document.documentElement.setAttribute('data-theme', theme)

  if (persist) writeStoredTheme(theme)
}

/**
 * Subscribes to OS-level theme changes.
 *
 * Only fires while the visitor has NOT made an explicit choice — an explicit
 * choice is meant to stick, so the system flipping to dark at sunset must not
 * silently override it.
 *
 * @param {(theme: 'light' | 'dark') => void} handler
 * @returns {() => void} unsubscribe
 */
export function onSystemThemeChange(handler) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}

  const query = window.matchMedia('(prefers-color-scheme: dark)')

  const listener = (event) => {
    // A stored choice outranks the system setting.
    if (readStoredTheme()) return
    handler(event.matches ? 'dark' : 'light')
  }

  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

/** Flips between light and dark and persists the result. */
export function toggleTheme(current) {
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}

export { STORAGE_KEY }