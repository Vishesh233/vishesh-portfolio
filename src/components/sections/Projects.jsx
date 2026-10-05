import { Section } from '../layout/Section.jsx'
import { Container } from '../layout/Container.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ProjectStage } from '../projects/ProjectStage.jsx'
import { projects } from '../../data/site.js'

/**
 * PROJECTS — the selected work.
 *
 * CONTINUITY WITH THE HERO
 * Same three typographic voices (display serif for headings, mono for metadata,
 * sans for prose), same hairline rules, same generous negative space and the
 * same ember eyebrow. The hero is one asymmetric composition; this is a
 * sequence of asymmetric spreads, so the section reads as the next chapter of
 * the same publication rather than a different website.
 *
 * Unlike the hero there is no 3D layer. The hero's lattice establishes depth
 * once, on arrival; repeating it here would compete with the project plates for
 * attention and cost a second render loop. Depth in this section comes from
 * asymmetry and space instead.
 *
 * STRUCTURE
 * `Section` owns the vertical rhythm and the anchor offset, so the existing
 * `#projects` navigation link keeps clearing the sticky header. The section owns
 * only its heading and the table of contents; every per-project decision lives
 * in ProjectStage.
 */
export function Projects() {
  if (projects.length === 0) return null

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <Container width="wide">
        {/*
          Masthead. The oversized numeral mirrors the folio carried by each
          stage, so the index is established before any entry appears and the
          numbering reads as one continuous sequence down the page.
        */}
        <div className="flex flex-col gap-8 pb-4 md:pb-8">
          <Reveal className="flex items-center gap-4 md:gap-6">
            <span
              aria-hidden="true"
              className="font-display text-[4rem] leading-none tracking-tighter text-foreground opacity-[0.07] select-none md:text-[6rem]"
            >
              02
            </span>

            <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-widest text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Selected Work
            </p>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.06}
            id="projects-heading"
            className="font-display text-display-md text-foreground-strong"
          >
            Projects
          </Reveal>

          {/*
            Table of contents. A magazine opens its work with an index, and it
            doubles as navigation: each entry anchors to its spread and carries
            the verified category beside the name. It is also what makes the
            section legible as a list before the visitor scrolls into it.

            Anchor links rather than buttons — they work without JavaScript, are
            keyboard operable by default, and keep the scroll position in the URL.
          */}
          <Reveal as="nav" delay={0.12} aria-label="Project index" className="mt-4">
            <ol className="flex flex-col border-t border-border">
              {projects.map((project, index) => (
                <li key={project.id} className="border-b border-border">
                  <a
                    href={`#${project.id}`}
                    className="group flex items-baseline gap-4 py-4 transition-colors duration-300 hover:text-accent md:gap-8"
                  >
                    <span
                      aria-hidden="true"
                      className="w-8 shrink-0 font-mono text-micro text-subtle transition-colors duration-300 group-hover:text-accent md:w-12"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="min-w-0 flex-1 truncate font-display text-title text-foreground-strong transition-colors duration-300 group-hover:text-accent">
                      {project.name}
                    </span>

                    <span className="hidden shrink-0 font-mono text-micro uppercase tracking-widest text-subtle sm:block">
                      {project.category}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {projects.map((project, index) => (
          <ProjectStage
            key={project.id}
            project={project}
            index={index}
            anchorId={project.id}
          />
        ))}
      </Container>
    </Section>
  )
}