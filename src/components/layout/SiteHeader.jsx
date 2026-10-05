import { useEffect, useState } from 'react'
import { Container } from './Container.jsx'
import { site, nav } from '../../data/site.js'
import { cn } from '../../lib/utils.js'

/**
 * Sticky site header and primary navigation.
 *
 * Reads its links from the `nav` registry in src/data/site.js, so adding a
 * section means editing data rather than markup.
 *
 * The active link is derived from scroll position via IntersectionObserver
 * rather than a scroll listener, so it costs nothing per frame. It is exposed
 * as `aria-current="page"` so assistive technology announces the position in
 * the page, not just a colour change.
 */
export function SiteHeader() {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    // Only observe sections that actually exist yet. The hero is built; the
    // rest arrive in later tasks and will be picked up automatically.
    const targets = nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    if (targets.length === 0 || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // The section occupying the most of the viewport wins. Sections are
        // tall, so this stays stable while scrolling through one.
        let best = null

        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry
          }
        }

        if (best) setActiveId(best.target.id)
      },
      {
        // Bias toward the top of the viewport so a section becomes active as
        // it reaches reading position, not when it merely peeks in.
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const target of targets) observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-nav glass border-b border-border">
      <Container
        width="wide"
        className="flex h-[var(--header-height)] items-center justify-between gap-6"
      >
        {/*
          The full name is wide in tracked mono. Below `sm` the monogram stands
          in for it so the four nav links keep their horizontal space and the
          header never forces the page wider than the viewport.
        */}
        <a
          href="#hero"
          className="shrink-0 font-mono text-caption uppercase tracking-widest text-foreground-strong transition-colors duration-200 hover:text-accent"
        >
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        <nav aria-label="Primary" className="min-w-0">
          <ul className="flex items-center gap-3 sm:gap-5 lg:gap-7">
            {nav.map((item) => {
              const isActive = activeId === item.id

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative whitespace-nowrap py-1 font-mono text-micro uppercase tracking-tight transition-colors duration-200 sm:text-caption sm:tracking-wide',
                      isActive
                        ? 'text-foreground-strong rule-accent-active'
                        : 'text-muted hover:text-foreground-strong',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </Container>
    </header>
  )
}