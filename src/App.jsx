import { SkipLink } from './components/layout/SkipLink.jsx'
import { SiteHeader } from './components/layout/SiteHeader.jsx'
import { SiteFooter } from './components/layout/SiteFooter.jsx'
import { Hero } from './components/sections/Hero.jsx'
import { About } from './components/sections/About.jsx'
import { Skills } from './components/sections/Skills.jsx'
import { Education } from './components/sections/Education.jsx'
import { Projects } from './components/sections/Projects.jsx'
import { Contact } from './components/sections/Contact.jsx'

/**
 * Application shell.
 *
 * Owns exactly three things:
 *   1. document landmarks (skip link, header, main, footer)
 *   2. the page background
 *   3. the section mount points
 *
 * Everything else belongs to a section component.
 *
 * BACKDROP
 * Deliberately flat. The warm gradient and colour blobs belong to the hero
 * alone, per the brief — carrying them across the whole page is what makes a
 * portfolio look like a gradient template. Everything below the hero composites
 * over the plain `--color-background`.
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
