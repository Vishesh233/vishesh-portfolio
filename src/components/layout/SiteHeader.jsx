import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Container } from './Container.jsx'
import { ThemeToggle } from '../ui/ThemeToggle.jsx'
import { nav, site } from '../../data/site.js'
import { useActiveSection } from '../../lib/utils.js'
import { duration } from '../../lib/motion.js'

/**
 * Sticky site header: brand, anchor navigation, theme toggle, mobile menu.
 *
 * DATA-DRIVEN
 * Links come from the `nav` registry in src/data/site.js and the active section
 * is derived from those same ids, so navigation and scroll-spy can never drift
 * apart — adding a section means editing data, not markup.
 *
 * SMOOTH SCROLLING
 * Anchor links rely on the `scroll-behavior: smooth` declared in base.css and
 * the `scroll-padding-top` that clears this header. `prefers-reduced-motion`
 * turns that off in the same stylesheet, so reduced motion is honoured without
 * any JavaScript here. The menu's own animation below reads the same media
 * query through `useReducedMotion`, so nothing moves when motion is reduced.
 *
 * ACTIVE STATE
 * `aria-current="location"` rather than "page" is correct here: these links
 * move within one page rather than between pages, and that distinction is what
 * a screen reader announces.
 */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef(null)

  const navIds = nav.map((item) => item.id)
  const activeId = useActiveSection(navIds)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  // Back/forward navigation changes the hash without clicking a link, so the
  // menu has to close on that too.
  useEffect(() => {
    if (!isMenuOpen) return

    window.addEventListener('hashchange', closeMenu)
    return () => window.removeEventListener('hashchange', closeMenu)
  }, [isMenuOpen, closeMenu])

  return (
    <header className="sticky top-0 z-nav border-b border-border bg-background/85 backdrop-blur-md">
      <Container
        width="wide"
        className="flex h-[var(--header-height)] items-center justify-between gap-4"
      >
        {/* Brand. Returns to the top of the page from anywhere. */}
        <a
          href="#hero"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5 rounded-xs text-foreground-strong transition-colors duration-200 hover:text-accent-ink"
        >
          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-xs bg-accent font-mono text-[0.6875rem] font-medium leading-none text-accent-on"
          >
            VK
          </span>

          {/* The monogram stands in for the full name on narrow screens, so the
              nav keeps its horizontal space and the header never overflows. */}
          <span className="font-mono text-caption tracking-tight sm:hidden">
            {site.shortName}
          </span>
          <span className="hidden font-mono text-caption tracking-tight sm:inline">
            {site.name}
          </span>
        </a>

        {/* Desktop navigation. Hidden below md, where the menu button takes over. */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {nav.map((item) => (
              <li key={item.id}>
                <NavLink item={item} isActive={activeId === item.id} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="grid size-9 place-items-center rounded-sm border border-border text-muted-strong transition-colors duration-200 hover:border-accent hover:text-accent-ink md:hidden"
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </Container>

      <MobileMenu
        id={menuId}
        isOpen={isMenuOpen}
        activeId={activeId}
        onNavigate={closeMenu}
        toggleRef={toggleRef}
      />
    </header>
  )
}

/** One desktop navigation link. */
function NavLink({ item, isActive }) {
  return (
    <a
      href={`#${item.id}`}
      aria-current={isActive ? 'location' : undefined}
      className={[
        'relative rounded-xs py-1 font-mono text-caption tracking-tight',
        'transition-colors duration-200',
        isActive
          ? 'text-foreground-strong rule-accent-active'
          : 'text-muted hover:text-foreground-strong',
      ].join(' ')}
    >
      {item.label}
    </a>
  )
}
/**
 * The mobile menu panel.
 *
 * KEYBOARD AND ESCAPE BEHAVIOUR
 * · Escape closes it and returns focus to the button that opened it, so focus
 *   is never left stranded behind a closed panel.
 * · Tab is deliberately NOT trapped. A navigation menu that closes on the next
 *   Tab is the expected behaviour for a site header; trapping focus would make
 *   the page behave like a dialog and would need a full focus-trap
 *   implementation for very little gain. The project modal, which genuinely is
 *   modal, does trap focus (Stage 3).
 * · The panel is unmounted when closed, so its links leave both the tab order
 *   and the accessibility tree — no hidden focus traps.
 */
function MobileMenu({ id, isOpen, activeId, onNavigate, toggleRef }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return

      onNavigate()
      toggleRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onNavigate, toggleRef])

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.nav
          id={id}
          aria-label="Primary"
          // Opacity only when motion is reduced, per the brief. The panel still
          // appears and disappears instantly rather than sliding.
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: duration.fast, ease: [0.25, 1, 0.5, 1] }}
          className="border-b border-border bg-background md:hidden"
        >
          <Container width="wide" className="py-3">
            <ul className="flex flex-col">
              {nav.map((item) => {
                const isActive = activeId === item.id

                return (
                  <li
                    key={item.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={onNavigate}
                      aria-current={isActive ? 'location' : undefined}
                      className={[
                        'flex items-center justify-between py-3.5 font-mono text-caption tracking-tight',
                        'transition-colors duration-200',
                        isActive
                          ? 'text-accent-ink'
                          : 'text-muted hover:text-foreground-strong',
                      ].join(' ')}
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-subtle">
                        →
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Container>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

/**
 * Hamburger / close mark.
 *
 * Two bars are drawn as spans and rotated into an X rather than swapped between
 * two separate icons, so the mark stays the same object throughout and the
 * change reads as one gesture rather than a flicker. `aria-hidden` because the
 * button's own label already carries the meaning.
 */
function MenuIcon({ isOpen }) {
  return (
    <span aria-hidden="true" className="relative block h-3 w-4">
      <span
        className={[
          'absolute left-0 block h-px w-full bg-current',
          'transition-transform duration-200',
          isOpen ? 'top-1.5 rotate-45' : 'top-0',
        ].join(' ')}
      />
      <span
        className={[
          'absolute left-0 block h-px w-full bg-current',
          'transition-transform duration-200',
          isOpen ? 'top-1.5 -rotate-45' : 'top-3',
        ].join(' ')}
      />
    </span>
  )
}