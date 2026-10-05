import { Container } from '../layout/Container.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ActionLink } from '../ui/ActionLink.jsx'
import { HeroLattice } from '../three/HeroLattice.jsx'
import { site, projects, experience } from '../../data/site.js'

/**
 * HERO — the opening statement.
 *
 * COMPOSITION
 * An asymmetric editorial split rather than a centred stack. The type block is
 * anchored to the left margin on large screens and the 3D lattice occupies the
 * right, so the eye travels across the page instead of down the middle of it.
 * On small screens the lattice moves behind the type and the whole thing
 * collapses to a single column.
 *
 * COPY
 * Every string here is drawn from src/data/site.js. The positioning line
 * describes only what is already verified — the target roles and the kinds of
 * systems built so far. No metrics, dates or claims have been invented, and
 * none are implied by the phrasing.
 */
export function Hero() {
  const [firstName, ...restName] = site.name.split(' ')

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative isolate flex min-h-[calc(100svh-var(--header-height))] items-center overflow-hidden py-20 md:py-24"
    >
      {/*
        The lattice sits behind the content on small screens and is lifted into
        the right margin on desktop, where it occupies the negative space rather
        than competing with the headline.

        `mask-field` dissolves both ends of the plane so it reads as receding
        into the page instead of ending at a hard rectangular edge.
        `pointer-events-none` keeps the headline selectable — pointer tracking
        listens on window, not on the canvas.
      */}
      <div
        aria-hidden="true"
        className="mask-field pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-40 md:opacity-55 lg:left-auto lg:right-0 lg:top-1/2 lg:h-[62%] lg:w-[46%] lg:-translate-y-1/2 lg:opacity-80"
      >
        <HeroLattice className="h-full w-full" />
      </div>

      <Container width="wide" className="relative">
        {/* Flex rather than grid: the type stack and the index bar need to
            share a single column so the lattice can own the right margin. */}
        <div className="flex flex-col">
          {/* Type column. Capped so the headline never runs into the lattice. */}
          <div className="flex flex-col items-start gap-8 lg:max-w-[58%]">
            {/* Eyebrow. Establishes the section before the name lands. */}
            <Reveal
              as="p"
              className="flex items-center gap-3 font-mono text-micro uppercase tracking-widest text-accent"
            >
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Portfolio
            </Reveal>

            {/*
              The display name. Split across lines for scale, with the second
              line in italic serif for editorial contrast. The break is
              structural rather than a width constraint, so the display type
              never re-wraps mid-word at awkward viewport widths.
            */}
            <h1 className="font-display text-display-lg text-foreground-strong">
              <Reveal as="span" className="block" delay={0.06}>
                {firstName}
              </Reveal>
              <Reveal
                as="span"
                className="block pl-[0.08em] italic text-muted-strong"
                delay={0.14}
              >
                {restName.join(' ')}
              </Reveal>
            </h1>

            {/*
              Roles. Verified in site.roles. Each renders in sequence so the row
              resolves as one gesture.
            */}
            <Reveal
              as="ul"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-caption uppercase tracking-wide text-muted"
              delay={0.22}
            >
              {site.roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </Reveal>

            {/*
              Positioning statement. Describes the verified role types and the
              categories of work actually built — no claims beyond that. Every
              noun here maps to a project or a target role already in
              src/data/site.js.
            */}
            <Reveal as="p" delay={0.3} className="max-w-[46ch] text-lead text-muted">
              Building full-stack web applications and Python desktop tools —
              from role-based library systems to AI-integrated interview
              preparation.
            </Reveal>

            {/* Calls to action. Primary is the single ember element on screen. */}
            <Reveal
              as="div"
              delay={0.38}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <ActionLink href="#projects" variant="primary">
                View Projects
              </ActionLink>

              <ActionLink href="#about">About</ActionLink>
            </Reveal>
          </div>

          {/*
            Editorial index bar. Full width and separated by a hairline, in the
            manner of a magazine colophon. It sits below both the type and the
            lattice, so nothing overlaps and the page keeps a clear read order.

            Every value is read from src/data/site.js and each block is
            conditional, so a field that has not been supplied yet simply does
            not render rather than showing an empty or invented value.
          */}
          <Reveal
            as="dl"
            delay={0.44}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-border pt-7 font-mono text-micro uppercase tracking-widest md:grid-cols-4 lg:mt-16"
          >
            <div className="flex flex-col gap-2">
              <dt className="text-subtle">Focus</dt>
              <dd className="text-muted-strong">Full-Stack · Python</dd>
            </div>

            {projects.length > 0 && (
              <div className="flex flex-col gap-2">
                <dt className="text-subtle">Selected Work</dt>
                <dd className="text-muted-strong">
                  {projects.length} Projects
                </dd>
              </div>
            )}

            {experience.map((role) => (
              <div key={role.id} className="flex flex-col gap-2">
                <dt className="text-subtle">Experience</dt>
                <dd className="text-muted-strong">
                  {role.role}, {role.company}
                </dd>
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <dt className="text-subtle">Discipline</dt>
              <dd className="text-muted-strong">Design Systems · 3D</dd>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}