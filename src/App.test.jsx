import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import { nav, site } from './data/site.js'

/**
 * Page-level checks: every nav link resolves to a section that is actually
 * mounted, the scroll-spy lights the right one, and the content review's
 * boundaries hold across the whole rendered page rather than per component.
 *
 * jsdom has no layout, so `getBoundingClientRect` is replaced with a scripted
 * layout the test controls, and IntersectionObserver is stubbed — the
 * scroll-spy only needs the constructor to exist so its resize listener
 * attaches; the test then drives the recomputation through that event.
 */
describe('page anchors and content', () => {
  const initialTops = {
    hero: -700,
    about: -350,
    skills: -80,
    education: 300,
    projects: 700,
    contact: 1100,
  }

  const scriptedTops = { ...initialTops }
  let originalGetBoundingClientRect

  beforeEach(() => {
    Object.assign(scriptedTops, initialTops)

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )

    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      const top = scriptedTops[this.id] ?? 0
      return {
        top,
        bottom: top + 600,
        left: 0,
        right: 1200,
        width: 1200,
        height: 600,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }
    }
  })

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    window.location.hash = ''
  })

  /** The desktop nav; present in the DOM regardless of viewport in jsdom. */
  function primaryNav() {
    return document.querySelector('header nav[aria-label="Primary"]')
  }

  it('gives every nav entry a link whose target is actually mounted', () => {
    render(<App />)

    expect(nav.length).toBeGreaterThan(0)

    for (const item of nav) {
      const link = primaryNav().querySelector(`a[href="#${item.id}"]`)
      expect(link, `link for #${item.id}`).toBeTruthy()
      expect(link.textContent).toContain(item.label)
      expect(document.getElementById(item.id), `section #${item.id}`).toBeTruthy()
    }
  })

  it('marks the section under the reading line with aria-current', async () => {
    render(<App />)

    // Reading line: 35% of jsdom's 768px viewport = 268.8px. With the scripted
    // tops above, skills is the last section whose top has crossed it.
    await waitFor(() => {
      expect(
        primaryNav().querySelector('a[href="#skills"]').getAttribute('aria-current'),
      ).toBe('location')
    })

    // Scroll on: education moves above the reading line and takes the mark.
    scriptedTops.education = 150
    window.dispatchEvent(new Event('resize'))

    await waitFor(() => {
      expect(
        primaryNav().querySelector('a[href="#education"]').getAttribute('aria-current'),
      ).toBe('location')
    })
    expect(
      primaryNav().querySelector('a[href="#skills"]').getAttribute('aria-current'),
    ).toBeNull()
  })


  it('moves the hash when a nav link is activated from the keyboard', async () => {
    const user = userEvent.setup()
    render(<App />)

    const link = primaryNav().querySelector('a[href="#contact"]')
    link.focus()
    await user.keyboard('{Enter}')

    expect(window.location.hash).toBe('#contact')
  })

  it('mounts education as a centre-line timeline with certifications below', () => {
    render(<App />)

    expect(document.getElementById('education-heading')).toBeTruthy()

    // TWO timeline entries today (college, then the older school entry);
    // the data file is an array, so growth is data.
    const timeline = document.querySelector('#education .timeline')
    expect(timeline).toBeTruthy()
    expect(timeline.children).toHaveLength(2)

    expect(screen.getByText('College of Engineering Roorkee')).toBeTruthy()
    expect(
      screen.getByText('B.Tech in Computer Science and Engineering'),
    ).toBeTruthy()
    expect(screen.getByText('September 2022 – July 2026')).toBeTruthy()

    // Round icon node riding the rail: cap for college, building for school.
    expect(document.querySelector('.timeline-node')).toBeTruthy()
    expect(document.querySelectorAll('.timeline-item')).toHaveLength(2)

    expect(screen.getByText('Data Structures and Algorithms')).toBeTruthy()
    expect(
      screen.getByText('80+ DSA problems solved on LeetCode and NeetCode'),
    ).toBeTruthy()

    // Certifications keep their heading, now as a single row of cards.
    expect(screen.getByRole('heading', { level: 3, name: 'Certifications' })).toBeTruthy()

    expect(screen.getByText('Generative AI Fundamentals')).toBeTruthy()
    expect(screen.getByText('Software Engineering Virtual Experience')).toBeTruthy()
    expect(screen.getByText('Technology Job Simulation')).toBeTruthy()
    // Exactly the two Forage entries carry the virtual-experience label.
    expect(screen.getAllByText('Virtual experience program')).toHaveLength(2)

    // Leadership was removed wholesale: no heading, no column, no content.
    expect(
      screen.queryByRole('heading', { level: 3, name: 'Leadership' }),
    ).toBeNull()
  })

  it('renders the school entry with the school-building node and no location text', () => {
    render(<App />)

    // Second entry — older than COER, so it follows it under newest-first
    // order, which also lands it on the right of the rail (odd index).
    const items = document.querySelectorAll('.timeline-item')
    expect(items).toHaveLength(2)
    const school = items[1]

    expect(screen.getByText('Jingle Bells Public School')).toBeTruthy()
    expect(screen.getByText('Class XII (Intermediate)')).toBeTruthy()

    // Footer right carries only the year the data file supplies. No start
    // date was given, so a range must not be assembled around it.
    expect(screen.getByText('2020')).toBeTruthy()

    // The school node wears the building glyph: its distinctive ground line.
    // The college node's cap path starts "M12 4.5 2.75 9" instead.
    const node = school.querySelector('.timeline-node')
    expect(node).toBeTruthy()
    expect(node.querySelector('path[d="M4.5 20.5h15"]')).toBeTruthy()

    // The card's ENTIRE text is the decorative index line plus the supplied
    // facts, so anything not given — a location, a board, a percentage, an
    // invented start year — would fail this match rather than slip through
    // quietly.
    const text = school.querySelector('.timeline-card').textContent
    expect(text).toMatch(
      /^02 — 2020Jingle Bells Public School\s*Class XII \(Intermediate\)\s*2020$/,
    )
  })

  it('renders the three About cards, with tools in place of leadership', () => {
    render(<App />)

    expect(screen.getByText('What I build')).toBeTruthy()
    expect(screen.getByText('How I practice')).toBeTruthy()
    expect(screen.getByText('Tools I work with')).toBeTruthy()
    expect(
      screen.getByText(/Git, GitHub, Postman, npm, VS Code and IntelliJ IDEA/),
    ).toBeTruthy()
  })

  it('gives the stat tiles the shared hover-pop treatment', () => {
    render(<App />)

    // Non-actionable, but still boxes: the same `card pop` every other
    // surface carries, so they lift, shadow and brighten identically.
    const tiles = document.querySelectorAll('#about .stat-tile')
    expect(tiles).toHaveLength(3)

    for (const tile of tiles) {
      expect(tile.classList.contains('card')).toBe(true)
      expect(tile.classList.contains('pop')).toBe(true)
    }

    expect(screen.getByText('80+')).toBeTruthy()
  })

  it('mounts the contact section with a labelled form and live status', () => {
    render(<App />)

    expect(document.getElementById('contact-heading')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Get in touch' })).toBeTruthy()

    expect(screen.getByLabelText('Name')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Message')).toBeTruthy()
    expect(document.getElementById('contact-gotcha')).toBeTruthy()

    const status = document.querySelector('#contact form [role="status"]')
    expect(status).toBeTruthy()
    expect(status.getAttribute('aria-live')).toBe('polite')

    // The direct channels sit beside the form, not instead of it.
    const mailLink = document.querySelector(`#contact a[href="mailto:${site.email}"]`)
    expect(mailLink).toBeTruthy()
    expect(mailLink.textContent).toBe(site.email)
  })

  it('carries none of the forbidden content anywhere on the page', () => {
    render(<App />)

    expect(document.body.textContent).not.toMatch(/Built with/)
    expect(document.querySelector('a[href^="tel:"]')).toBeNull()
    expect(document.getElementById('experience')).toBeNull()

    // Leadership, and the two organisations it named, were removed wholesale
    // — section, About card and data alike. Nothing may reintroduce them.
    expect(document.body.textContent).not.toMatch(/Leadership/)
    expect(document.body.textContent).not.toMatch(/Praharsh/)
    expect(document.body.textContent).not.toMatch(/Unnat Bharat Abhiyan/)
    expect(document.body.textContent).not.toMatch(/Beyond code/)

    const headings = [...document.querySelectorAll('h2, h3')].map((heading) =>
      heading.textContent.trim(),
    )
    expect(headings).not.toContain('Experience')
    expect(headings).not.toContain('Leadership')
  })

  it('closes with a footer that has a live year and a way back to the top', () => {
    render(<App />)

    const footer = screen.getByRole('contentinfo')
    expect(footer.textContent).toContain(`© ${new Date().getFullYear()} Vishesh Khanna`)

    const backToTop = screen.getByRole('link', { name: 'Back to top' })
    expect(backToTop.getAttribute('href')).toBe('#hero')
    expect(document.getElementById('hero')).toBeTruthy()
  })
})