import { Section } from '../layout/Section.jsx'
import { Container } from '../layout/Container.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { AboutMeta } from '../about/AboutMeta.jsx'
import { projects, about } from '../../data/site.js'

/**
 * ABOUT — the background.
 *
 * CONTINUITY WITH THE HERO AND PROJECTS
 * The same three voices (Instrument Serif for display, Geist Mono for metadata,
 * Geist for prose), the same hairline rules, the same ghosted folio numeral and
 * the same ember eyebrow. Nothing new is introduced here — the section is
 * assembled entirely from primitives the other two already established, so it
 * reads as the same publication rather than a separate page bolted on.
 *
 * FOLIO ORDER
 * This section is numbered 01 and Projects is 02, so the background is read
 * before the work. The numbering is presentation, not a claim about sequence or
 * seniority.
 *
 * COMPOSITION
 * An asymmetric two-column editorial spread rather than a centred paragraph or a
 * profile card. The statement is set large and hangs from the left margin across
 * roughly two thirds of the grid; the metadata column occupies the outer right
 * margin and is set small, so the page has one clear reading path and a quiet
 * secondary one. Beneath both, a hairline band lists the three areas of work as
 * a typographic index — the section's one structural flourish.
 *
 * There is no portrait and no card. Nothing here needs to look like a CV.
 *
 * RESTRAINT
 * No 3D, no plate artwork and no scroll-linked movement. The hero owns the
 * lattice and Projects owns the plates; a third visual device here would compete
 * with both. Depth comes from scale contrast and negative space, and the section
 * deliberately sits quieter than its neighbours.
 */
export function About() {
  return (
    <Section id="about" aria-labelledby="about-heading">
      <Container width="wide">
        {/* Masthead. Identical construction to the Projects masthead so the two
            sections open as a matched pair. */}
        <div className="flex flex-col gap-8 pb-4 md:pb-8">
          <Reveal className="flex items-center gap-4 md:gap-6">
            <span
              aria-hidden="true"
              className="font-display text-[4rem] leading-none tracking-tighter text-foreground opacity-[0.07] select-none md:text-[6rem]"
            >
              01
            </span>

            <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-widest text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Background
            </p>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.06}
            id="about-heading"
            className="font-display text-display-md text-foreground-strong"
          >
            About
          </Reveal>
        </div>

        {/*
          The body. Explicit `row-start` on both children rather than relying on
          source order, so the statement and the margin column keep their
          relationship to each other at every breakpoint instead of reflowing
          unpredictably when either one's content changes.
        */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 border-t border-border pt-14 lg:grid-cols-12 lg:gap-y-0 lg:pt-20">
          {/* Statement. Set at display scale because it is the only prose in the
              section that is actually a claim about the work. */}
          <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <Reveal
              as="p"
              delay={0.12}
              className="max-w-[26ch] font-display text-title leading-[1.15] text-foreground-strong lg:text-[2.5rem]"
            >
              {about.statement}
            </Reveal>
          </div>

          {/* Metadata column, in the outer margin. */}
          <Reveal
            delay={0.2}
            className="w-full lg:col-span-4 lg:col-start-9 lg:row-start-1"
          >
            <AboutMeta />
          </Reveal>

          {/*
            The index band. A full-bleed hairline closes the spread, and beneath
            it the areas of work are listed as a typographic index — number,
            category, and the one-line verified summary.

            This is the section's single structural flourish and it earns its
            place by restating real data in a form the Projects section does not
            already use: Projects shows the work in depth, this shows its shape
            at a glance. The categories come straight from `projects`, so the two
            sections can never disagree about what was built.

            Deliberately not links: the project ids are anchors *inside* Projects,
            and linking here would duplicate the contents rail that already does
            that job one screen down.
          */}
          <div className="lg:col-span-12 lg:col-start-1 lg:row-start-2 lg:mt-24">
            <Reveal
              as="p"
              delay={0.26}
              className="font-mono text-micro uppercase tracking-widest text-subtle"
            >
              Areas of Work
            </Reveal>

            <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-3">
              {projects.map((project, index) => (
                <li key={project.id} className="flex flex-col gap-3 border-t border-border pt-5">
                  <span
                    aria-hidden="true"
                    className="font-display text-[2.5rem] leading-none tracking-tighter text-foreground opacity-[0.07]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="font-display text-title text-foreground-strong">
                    {project.category}
                  </p>

                  {project.summary && (
                    <p className="max-w-[34ch] text-body-sm text-muted">
                      {project.summary}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}