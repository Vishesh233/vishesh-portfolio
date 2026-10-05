import { useEffect, useState } from 'react'

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
 * Which section is the reader currently in.
 *
 * WHY INTERSECTIONOBSERVER AND NOT A SCROLL LISTENER
 * A scroll handler would run on every frame and recompute geometry for every
 * section. IntersectionObserver is handed to the browser and evaluated off the
 * main thread, so the cost is effectively zero while idle.
 *
 * WHY THIS DOESN'T SIMPLY PICK THE "MOST VISIBLE" SECTION
 * That approach breaks on short sections and at the very top and bottom of the
 * document: when the page is scrolled to the end, the last short section can
 * never reach the threshold that a tall one does, so the highlight sticks to
 * the previous entry. Instead this tracks every section's position against a
 * reading line a little below the top of the viewport, and marks whichever
 * section that line falls inside. Short and tall sections are treated
 * identically, and the last section always wins at the bottom of the page.
 *
 * The reading line sits below the sticky header because the header covers the
 * top of the viewport — highlighting a section that is only visible behind the
 * header would feel wrong.
 */
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(() => ids[0] ?? null)

  useEffect(() => {
    // Re-run whenever the section list changes, so adding a section to the
    // registry is enough to have it tracked.
    if (ids.length === 0) return
    if (typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    // Visible band, offset to clear the sticky header and to ignore the last
    // ~25% of the viewport so the next section is not highlighted before the
    // reader has actually arrived at it.
    const headerOffset = getHeaderOffset()
    const readingLine = window.innerHeight * 0.35

    /**
     * Chooses the active section from current geometry.
     * Called on every observed change rather than trusting each entry in
     * isolation, because a single intersection callback can fire for several
     * sections at once and no individual entry knows about the others.
     */
    const update = () => {
      let current = null

      for (const element of elements) {
        const rect = element.getBoundingClientRect()

        // A section counts as active once its top has passed the reading line.
        // Past the bottom of the document the last section is the answer, and
        // this condition handles that case without a special-case branch.
        if (rect.top - headerOffset <= readingLine) {
          current = element.id
        }
      }

      // Above the very first section (overscroll, or a restored scroll
      // position): fall back to the first one rather than leaving nothing lit.
      if (current === null) current = elements[0].id

      setActiveId((previous) => (previous === current ? previous : current))
    }

    const observer = new IntersectionObserver(update, {
      // Any change in the observed band can move the answer, so fire on entry
      // and exit rather than at a set of discrete ratios.
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    for (const element of elements) observer.observe(element)

    // Recompute on resize: the reading line is a fraction of the viewport, so
    // a change in height can move which section is active even when nothing
    // intersected differently.
    window.addEventListener('resize', update, { passive: true })

    // Establish the correct value immediately — on a reload the browser
    // restores the previous scroll position, and without this the highlight
    // would be wrong until the reader scrolled.
    update()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return activeId
}

/**
 * Reads the sticky header's height from the CSS custom property that tokens.css
 * defines, so the reading line and the header can never disagree.
 */
function getHeaderOffset() {
  if (typeof window === 'undefined') return 0

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-height')
    .trim()

  // "4.25rem" -> 68px. Any unexpected format falls back to 0, which only makes
  // the highlight slightly early rather than breaking it.
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed)) return 0

  return raw.endsWith('rem') ? parsed * 16 : parsed
}