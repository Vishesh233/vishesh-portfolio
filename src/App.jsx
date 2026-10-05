import { SkipLink } from './components/layout/SkipLink.jsx'
import { SiteHeader } from './components/layout/SiteHeader.jsx'
import { Container } from './components/layout/Container.jsx'
import { Hero } from './components/sections/Hero.jsx'
import { About } from './components/sections/About.jsx'
import { Projects } from './components/sections/Projects.jsx'
import { Experience } from './components/sections/Experience.jsx'
import { site } from './data/site.js'

/**
 * Application shell.
 *
 * Owns exactly three things:
 *   1. document landmarks (skip link, header, main, footer)
 *   2. the global background layers that every section composites over
 *   3. the section mount points
 *
 * Everything else belongs to a section component.
 *
 * The background is layered deliberately rather than being a single flat fill:
 * a base ink wash, one very soft ember bloom behind the hero area, and a
 * fine grain overlay. The bloom is low-opacity and heavily diffused so it reads
 * as depth rather than as a decorative gradient.
 *
 * The hero's 3D lattice renders inside the Hero section rather than here, so
 * that pausing and cleanup travel with the component that owns the canvas.
 */
export default function App() {
  return (
    <>
      <SkipLink />

      {/* Decorative background stack. Hidden from assistive tech — it carries
          no information, and announcing it would be noise. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-ember-500)_12%,transparent),transparent_70%)]" />
        <div className="grain-overlay" />
      </div>

      <SiteHeader />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Projects />
        <Experience />

        {/*
          Education, Skills and Contact are not built yet. The navigation anchors
          already point at their ids, so they resolve automatically as each
          section is added — no shell change required.
        */}
      </main>

      <footer className="border-t border-border">
        <Container width="wide" className="flex flex-col gap-2 py-10">
          <p className="font-mono text-caption text-muted">{site.name}</p>
          <p className="font-mono text-micro uppercase tracking-widest text-subtle">
            Built with React, Vite &amp; Tailwind
          </p>
        </Container>
      </footer>
    </>
  )
}
