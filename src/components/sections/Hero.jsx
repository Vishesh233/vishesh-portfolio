import { Container } from '../layout/Container.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ActionLink } from '../ui/ActionLink.jsx'
import { Portrait } from '../ui/Portrait.jsx'
import { SocialLinks } from '../ui/SocialLinks.jsx'
import { CopyEmail } from '../ui/CopyEmail.jsx'
import { DownloadIcon, ArrowIcon, ChevronIcon } from '../ui/Icons.jsx'
import { site } from '../../data/site.js'

/**
 * HERO — the opening statement.
 *
 * COMPOSITION
 * Two columns on large screens: the type stack on the left, the portrait on the
 * right. The type column is capped so the display heading never runs into the
 * portrait, and everything collapses to one column on small screens with the
 * portrait first so the page opens on a face rather than on a wall of text.
 *
 * THE GLOW
 * Two heavily-blurred colour discs, absolutely positioned and `aria-hidden`:
 * deep blue low-left, cyan high-right — the navy canvas lit from two corners.
 * In the light theme the same wash tokens resolve to faint sky and cyan, so
 * the glow whispers instead of shouting. This is the only place on the page
 * where a gradient appears — repeating it further down is what turns a
 * portfolio into a gradient template. Both discs are hidden entirely under
 * `prefers-reduced-motion`, where a static glow would serve no purpose.
 *
 * SCROLL TARGETS
 * "Get in touch" and "View work" are plain anchor links. Native smooth
 * scrolling and the header-clearing `scroll-padding-top` are already handled
 * in base.css, and `prefers-reduced-motion` disables them there — so no
 * JavaScript scroll handler is needed, and none is written.
 *
 * COPY
 * Every string comes from src/data/site.js. The intro states the frameworks
 * actually used and the DSA count; it asserts no years of experience, no
 * outcomes and no specialisation beyond what is on record.
 */
export function Hero() {
  const [firstName, lastName] = site.name.split(' ')

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="section relative flex min-h-[calc(100svh-var(--header-height))] items-center overflow-hidden"
    >
      {/* Hero-only glow: blue low-left, cyan high-right. The cores sit
          off-canvas so only their blurred tails cross the edge — a blob must
          never sit at full strength behind text. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-wash-blue/40 blur-3xl motion-reduce:hidden" />
        <div className="absolute -right-28 -top-28 size-80 rounded-full bg-wash-cyan/35 blur-3xl motion-reduce:hidden" />
      </div>

      <Container width="wide" className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---------------------------------------------------------- TYPE */}
          <div className="order-2 flex flex-col items-start gap-6 lg:order-1 lg:col-span-7">
            <Reveal
              as="p"
              className="flex items-center gap-3 font-mono text-micro tracking-widest text-subtle uppercase"
            >
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Portfolio
            </Reveal>

            {/*
              One h1 for the whole page. The greeting is set in Geist and the
              surname in Instrument Serif, so the serif reads as an accent word
              inside a sans heading rather than as a second heading style. The
              name carries the theme's gradient: flat text-safe blue in light,
              sky → cyan in dark — the stops are owned by the theme tokens,
              never by this component.
            */}
            <Reveal as="h1" className="text-display-md leading-[1.02]">
              <span className="block font-sans text-[0.62em] tracking-tight text-muted">
                Hi, I&rsquo;m
              </span>
              <span className="text-gradient-name mt-1 block">
                {firstName}{' '}
                <span className="font-display italic tracking-tighter">
                  {lastName}
                </span>
              </span>
            </Reveal>

            <Reveal
              as="p"
              className="font-mono text-caption tracking-wide text-accent-ink uppercase"
            >
              {site.role}
            </Reveal>

            {/* Two lines. Frameworks actually used, plus the DSA count. */}
            <Reveal
              as="p"
              className="max-w-[52ch] text-lead text-muted"
            >
              I build full-stack web applications with React on the front end
              and Node.js, Express and MongoDB behind them — covering REST
              APIs, JWT authentication and role-based access control.
            </Reveal>

            {/* Calls to action. "Get in touch" is the single primary. */}
            <Reveal className="flex flex-wrap items-center gap-3 pt-1">
              <ActionLink
                href="#contact"
                variant="primary"
                icon={<ArrowIcon className="ml-1 size-4" />}
                arrow={false}
              >
                Get in touch
              </ActionLink>

              <ActionLink href="#projects">View work</ActionLink>

              <ActionLink
                href={site.resumeUrl}
                download={site.resumeFileName}
                icon={<DownloadIcon className="ml-1 size-4" />}
                arrow={false}
              >
                Download CV
              </ActionLink>
            </Reveal>

            {/* Social icons, then the address spelled out beside a copy button. */}
            <Reveal className="flex flex-col gap-3 pt-2">
              <SocialLinks />
              <CopyEmail />
            </Reveal>
          </div>

          {/* ------------------------------------------------------ PORTRAIT */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
            <Reveal>
              <Portrait shape="circle" size="w-56 sm:w-64 lg:w-80" priority />
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Scroll-down affordance: a real anchor to the next section, so it
          works without JavaScript and honours the same scroll-padding as any
          other in-page link. Sits in the section's bottom padding, below the
          content; the loop goes static under reduced motion. Centred with flex
          rather than a translate utility so the keyframe's transform is the
          only transform on the element. */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="scroll-hint absolute inset-x-0 bottom-5 flex justify-center text-muted transition-colors duration-200 hover:text-accent-ink"
      >
        <ChevronIcon className="size-5" />
      </a>
    </section>
  )
}