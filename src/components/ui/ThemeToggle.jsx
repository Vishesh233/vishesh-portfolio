import { useCallback, useEffect, useState } from 'react'
import { applyTheme, getAppliedTheme, onSystemThemeChange } from '../../lib/theme.js'

/**
 * Light/dark toggle.
 *
 * WHY A BUTTON AND NOT A CHECKBOX
 * A checkbox implies a form field; this is a control that changes the whole
 * document, so it is a real `<button>` with a clear accessible name. The
 * pressed state is exposed through `aria-pressed`, which is what a screen
 * reader announces — the sun/moon icons are decorative.
 *
 * WHY IT IS NOT A CONTEXT
 * The theme lives on an attribute on <html>, and every token resolves from it
 * via `light-dark()`. Only the icon needs to know which theme is active, so a
 * context provider would re-render the tree for no benefit. This component
 * keeps its own tiny state and syncs it with the document.
 *
 * ON FIRST MOUNT
 * The inline script in index.html has already applied the correct theme before
 * React mounts, so state is initialised from the DOM rather than from
 * `prefers-color-scheme`. Reading the media query here instead would
 * contradict the boot script and cause a visible switch on load.
 */
export function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(getAppliedTheme)

  // Follow the OS only while the visitor has expressed no preference of their
  // own. `applyTheme` is called without `persist` so an OS-level change never
  // becomes a stored choice behind the visitor's back.
  useEffect(() => onSystemThemeChange((systemTheme) => {
    setTheme(systemTheme)
    applyTheme(systemTheme, { persist: false })
  }), [])

  const handleToggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return next
    })
  }, [])

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      className={[
        'pop-strong grid size-9 shrink-0 place-items-center rounded-sm border border-border',
        'text-muted-strong transition-colors duration-200',
        'hover:text-accent-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Both icons are always mounted and cross-faded, so the button never
          changes size and the swap costs one opacity transition. Both are
          aria-hidden because the button's own label carries the meaning. */}
      <span className="relative grid size-4 place-items-center">
        <SunIcon
          className={[
            'absolute size-4 transition-opacity duration-200',
            isDark ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        />
        <MoonIcon
          className={[
            'absolute size-4 transition-opacity duration-200',
            isDark ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
      </span>
    </button>
  )
}

/** Sun. Light theme is the resting state, so this is the default mark. */
function SunIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

/** Moon. Dark theme. */
function MoonIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}