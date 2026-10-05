import { SkipLink } from './components/layout/SkipLink.jsx'
import { SiteHeader } from './components/layout/SiteHeader.jsx'
import { Container } from './components/layout/Container.jsx'
import { Hero } from './components/sections/Hero.jsx'
import { About } from './components/sections/About.jsx'
import { Skills } from './components/sections/Skills.jsx'

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
 * Home, About, Skills, Projects, Education, Contact — matching the `sections`
 * registry in src/data/site.js, which the header's scroll-spy also reads. About
 * and Skills are mounted now; Projects, Education and Contact arrive in the
 * later stages, and their nav links resolve as each section lands.
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
      </main>

      <footer className="border-t border-border">
        <Container width="wide" className="flex flex-col gap-2 py-10">
          <p className="font-mono text-caption text-muted">
            © {new Date().getFullYear()} Vishesh Khanna
          </p>
          <p className="font-mono text-caption text-subtle">
            Built with React, Vite &amp; Tailwind
          </p>
        </Container>
      </footer>
    </>
  )
}
