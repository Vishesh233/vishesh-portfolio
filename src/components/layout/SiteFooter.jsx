import { site } from '../../data/site.js'
import { Container } from './Container.jsx'
import { SocialLinks } from '../ui/SocialLinks.jsx'

/**
 * The page footer: who wrote it, when, and the way back to the top.
 *
 * WHAT IS DELIBERATELY ABSENT
 * No "Built with X" line. The stack is visible in the repository, and a
 * framework credit in the footer is the one piece of text on a page like
 * this that nobody came to read. The copyright is the year at runtime
 * rather than a hard-coded string, so it cannot quietly go stale.
 *
 * "Back to top" is a real anchor to `#hero`, so it works with JavaScript
 * disabled, is crawlable, and lands on the same offset as every other
 * section link.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <Container
        width="wide"
        className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row"
      >
        <p className="font-mono text-caption text-muted">
          © {year} {site.name}
        </p>

        <div className="flex items-center gap-6">
          <SocialLinks />
          <a
            href="#hero"
            className="font-mono text-caption text-muted transition-colors duration-200 hover:text-accent-ink"
          >
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  )
}