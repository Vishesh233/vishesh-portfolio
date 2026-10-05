import { SkipLink } from './components/layout/SkipLink.jsx'
import { SiteHeader } from './components/layout/SiteHeader.jsx'
import { Container } from './components/layout/Container.jsx'

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
 * SECTIONS
 * Stages 2-4 mount About, Skills, Projects, Education and Contact here. Until
 * then the shell renders the hero only, so the header's scroll-spy has one
 * real target and no link points at an id that does not exist.
 */
export default function App() {
  return (
    <>
      <SkipLink />

      <SiteHeader />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        {/* PLACEHOLDER — replaced by the real Hero in Stage 2. */}
        <section
          id="hero"
          aria-label="Introduction"
          className="section flex min-h-[calc(100svh-var(--header-height))] items-center"
        >
          <Container width="wide">
            <h1 className="text-display-md font-display text-foreground-strong">
              Vishesh Khanna
            </h1>
          </Container>
        </section>
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
