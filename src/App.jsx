import { useEffect } from 'react'
import { SkipLink } from './components/layout/SkipLink.jsx'
import { SiteHeader } from './components/layout/SiteHeader.jsx'
import { SiteFooter } from './components/layout/SiteFooter.jsx'
import { Hero } from './components/sections/Hero.jsx'
import { About } from './components/sections/About.jsx'
import { Skills } from './components/sections/Skills.jsx'
import { Education } from './components/sections/Education.jsx'
import { Projects } from './components/sections/Projects.jsx'
import { Contact } from './components/sections/Contact.jsx'
import { installCursorGlow } from './lib/cursorGlow.js'

/**
 * Application shell.
 *
 * Owns exactly four things:
 *   1. document landmarks (skip link, header, main, footer)
 *   2. the page background
 *   3. the section mount points
 *   4. the cursor light — one delegated listener set for every card/box on
 *      the page (see src/lib/cursorGlow.js), bound once here rather than
 *      per component so the effect and the `.pop`/`.card` CSS stay a pair
 *
 * Everything else belongs to a section component.
 *
 * BACKDROP
 * Deliberately restrained. The glow blobs belong to the hero alone, per the
 * brief — repeating them across the whole page is what makes a portfolio look
 * like a gradient template. Everything below the hero composites over the
 * plain `--color-background` (plus, in the dark theme, the faint canvas
 * gradient declared in base.css).
 *
 * SECTION ORDER
 * Hero, About, Skills, Education, Projects, Contact — matching the `sections`
 * registry in src/data/site.js, which the header's scroll-spy also reads, so
 * every nav link resolves to a section that is actually mounted.
 *
 * `deferred` hands off-screen sections to the browser via content-visibility.
 * It is NOT applied to the hero, which is on screen immediately.
 */
export default function App() {
  // StrictMode double-invokes effects in development: the second install
  // runs after the first cleanup, so exactly one listener set survives.
  useEffect(() => installCursorGlow(), [])

  return (
    <>
      <SkipLink />

      <SiteHeader />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About deferred />
        <Skills deferred />
        <Education deferred />
        <Projects deferred />
        <Contact />
      </main>

      <SiteFooter />
    </>
  )
}
