import { Reveal } from '../motion/Reveal.jsx'
import { ActionLink } from '../ui/ActionLink.jsx'
import { ProjectFrame } from './ProjectFrame.jsx'
import { cn } from '../../lib/utils.js'

/**
 * One project, presented as an editorial spread.
 *
 * COMPOSITION
 * Not a card grid. Each project is a spread in which the information block is
 * anchored to one margin and the plate occupies the other, alternating down the
 * section. An oversized ghosted numeral in the outer margin and a full-bleed
 * hairline carry the "folio" reading, so the eye travels across the page rather
 * than scanning tiles.
 *
 * Three LAYOUTS, not one layout mirrored
 * Mirroring alone settles into a repeated rhythm by the third entry, so the last
 * project breaks the pattern: a wide plate on top with the information set
 * beneath it as a band. The section reads as three designed spreads rather than
 * one template applied three times.
 *
 * DATA
 * Only verified fields render. `href` and `repository` are currently null on
 * every project, so the CTA row emits nothing — an empty row would imply
 * somewhere to go that does not exist. The markup exists so that adding a real
 * URL to src/data/site.js is the only change required.
 */
export function ProjectStage({ project, index, anchorId }) {
  const number = String(index + 1).padStart(2, '0')
  const headingId = `project-${project.id}-title`
  const layout = LAYOUTS[index % LAYOUTS.length]

  const stack = project.stack ?? []
  const hasLinks = Boolean(project.href || project.repository)

  return (
    <article
      id={anchorId}
      aria-labelledby={headingId}
      className={cn(
        'relative grid scroll-mt-[calc(var(--header-height)+2rem)] grid-cols-1 gap-x-12 border-t border-border py-16 md:py-24 lg:gap-y-0 lg:py-32',
        layout.article,
      )}
    >
      {/*
        The folio numeral. Sits in the outer margin on large screens so it reads
        as a page number rather than a label attached to the project, and falls
        into the flow on small screens where there is no margin to hold it.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-1 right-0 select-none font-display text-[4.5rem] leading-none tracking-tighter text-foreground opacity-[0.07]',
          layout.folio,
        )}
      >
        {number}
      </span>

      {/* Information block. */}
      <div className={cn('flex flex-col items-start gap-6', layout.info)}>
        <Reveal
          as="p"
          className="flex items-center gap-3 font-mono text-micro uppercase tracking-widest text-accent"
        >
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          {project.category}
        </Reveal>

        <Reveal
          as="h3"
          delay={0.06}
          id={headingId}
          className="font-display text-display-sm text-foreground-strong"
        >
          {project.name}
        </Reveal>

        {project.summary && (
          <Reveal as="p" delay={0.12} className="max-w-[42ch] text-lead text-muted">
            {project.summary}
          </Reveal>
        )}

        {/*
          Technical metadata as a definition list rather than a row of chips. A
          `dl` is the correct structure for label/value pairs, and setting it
          behind hairlines matches the editorial language of the rules elsewhere
          on the page. Each block is conditional, so an unverified field never
          renders as an empty row.
        */}
        {(stack.length > 0 || project.category) && (
          <Reveal
            as="dl"
            delay={0.18}
            className="mt-2 flex w-full max-w-[42ch] flex-col font-mono"
          >
            {project.category && (
              <div className="flex items-baseline justify-between gap-6 border-t border-border py-3">
                <dt className="shrink-0 text-micro uppercase tracking-widest text-subtle">
                  Type
                </dt>
                <dd className="text-caption text-muted-strong">{project.category}</dd>
              </div>
            )}

            {stack.length > 0 && (
              <div className="flex items-baseline justify-between gap-6 border-t border-border py-3">
                <dt className="shrink-0 text-micro uppercase tracking-widest text-subtle">
                  Stack
                </dt>
                <dd className="flex flex-wrap justify-end gap-x-2 text-caption text-muted-strong">
                  {stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </dd>
              </div>
            )}
          </Reveal>
        )}

        {hasLinks && (
          <Reveal delay={0.24} className="flex flex-wrap gap-4 pt-3">
            {project.href && (
              <ActionLink href={project.href} rel="noopener noreferrer" target="_blank">
                Live Site
              </ActionLink>
            )}
            {project.repository && (
              <ActionLink
                href={project.repository}
                rel="noopener noreferrer"
                target="_blank"
              >
                Repository
              </ActionLink>
            )}
          </Reveal>
        )}
      </div>

      {/* Visual stage: opposite the text on desktop, beneath it on mobile. */}
      <ProjectFrame
        project={project}
        variant={PLATE_VARIANTS[project.id] ?? 'catalogue'}
        ratio={layout.ratio}
        className={layout.frame}
      />
    </article>
  )
}

/**
 * Per-entry art direction: which margin the text sits in, how large the plate
 * runs, and how the two are proportioned.
 *
 * This is presentation rather than content, so it lives here and not in
 * src/data/site.js — data stays factual, presentation stays here. Selected by
 * index rather than by id so a fourth project still receives a designed spread
 * instead of falling through to a default.
 */
const LAYOUTS = [
  {
    // 01 — text left, generous plate right. The establishing spread.
    article: 'lg:grid-cols-12',
    info: 'lg:col-span-5 lg:col-start-1 lg:row-start-1',
    frame: 'lg:col-span-7 lg:col-start-6 lg:row-start-1',
    folio: 'lg:-top-4 lg:left-0 lg:text-[9rem]',
    ratio: 'aspect-[4/3] lg:aspect-[16/11]',
  },
  {
    // 02 — mirrored, but the plate is wider and the text column narrower, so
    // the flip does not read as the same layout turned around.
    article: 'lg:grid-cols-12',
    info: 'lg:col-span-4 lg:col-start-9 lg:row-start-1',
    frame: 'lg:col-span-8 lg:col-start-1 lg:row-start-1',
    folio: 'lg:-top-4 lg:right-0 lg:text-[9rem]',
    ratio: 'aspect-[4/3] lg:aspect-[16/9]',
  },
  {
    // 03 — the break. A full-width plate with the information set beneath it
    // as a band, ending the section on the largest image rather than a third
    // repetition of the two-column spread.
    article: 'lg:grid-cols-12',
    info: 'lg:col-span-12 lg:col-start-1 lg:row-start-2 lg:mt-14',
    frame: 'lg:col-span-12 lg:col-start-1 lg:row-start-1',
    folio: 'lg:-top-6 lg:left-0 lg:text-[11rem]',
    ratio: 'aspect-[16/10]',
  },
]

/**
 * Which abstract composition suits which project.
 *
 * This is art direction rather than content, so it lives with the presentation
 * and not in src/data/site.js. Keyed by id and defaulted, so an unknown project
 * still renders.
 */
const PLATE_VARIANTS = {
  libverse: 'catalogue',
  interviewpilot: 'pipeline',
  'qr-code-studio': 'module',
}