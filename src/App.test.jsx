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

  it('mounts education with one timeline entry and both columns below', () => {
    render(<App />)

    expect(document.getElementById('education-heading')).toBeTruthy()

    // ONE timeline entry today; the data file is an array, so growth is data.
    const timeline = document.querySelector('#education ol')
    expect(timeline).toBeTruthy()
    expect(timeline.children).toHaveLength(1)
    expect(screen.getByText('College of Engineering Roorkee')).toBeTruthy()
    expect(screen.getByText('September 2022 – July 2026')).toBeTruthy()

    expect(screen.getByRole('heading', { level: 3, name: 'Certifications' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Leadership' })).toBeTruthy()

    expect(screen.getByText('Generative AI Fundamentals')).toBeTruthy()
    expect(screen.getByText('Software Engineering Virtual Experience')).toBeTruthy()
    expect(screen.getByText('Technology Job Simulation')).toBeTruthy()
    // Exactly the two Forage entries carry the virtual-experience label.
    expect(screen.getAllByText('Virtual experience program')).toHaveLength(2)

    expect(screen.getByText('Praharsh')).toBeTruthy()
    expect(screen.getByText('Blood donation drives')).toBeTruthy()
    expect(screen.getByText('Clothing drives')).toBeTruthy()
    expect(screen.getByText('Unnat Bharat Abhiyan')).toBeTruthy()
    expect(
      screen.getByText('Village outreach with plants and school supplies'),
    ).toBeTruthy()
  })

  it('mounts the contact section with a labelled form and live status', () => {
    render(<App />)

    expect(document.getElementById('contact-heading')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Get In Touch' })).toBeTruthy()

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

    expect(document.body.textContent).not.toMatch(/Flask/)
    expect(document.body.textContent).not.toMatch(/Built with/)
    expect(document.querySelector('a[href^="tel:"]')).toBeNull()
    expect(document.getElementById('experience')).toBeNull()

    const headings = [...document.querySelectorAll('h2, h3')].map((heading) =>
      heading.textContent.trim(),
    )
    expect(headings).not.toContain('Experience')
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