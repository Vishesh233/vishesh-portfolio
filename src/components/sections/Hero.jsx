import { Container } from '../layout/Container.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ActionLink } from '../ui/ActionLink.jsx'
import { Portrait } from '../ui/Portrait.jsx'
import { SocialLinks } from '../ui/SocialLinks.jsx'
import { CopyEmail } from '../ui/CopyEmail.jsx'
import { DownloadIcon, ArrowIcon } from '../ui/Icons.jsx'
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
 * THE BLOBS
 * Two heavily-blurred accent discs, absolutely positioned and `aria-hidden`.
 * This is the only place on the page where a gradient appears — repeating it
 * further down is what turns a warm palette into a gradient template. Both sit
 * at low opacity and are hidden entirely under `prefers-reduced-motion`, where
 * a static glow would serve no purpose.
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
      {/* Warm gradient blobs — hero only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 size-96 rounded-full bg-wash-coral/25 blur-3xl motion-reduce:hidden" />
        <div className="absolute -right-24 top-1/3 size-80 rounded-full bg-wash-teal/20 blur-3xl motion-reduce:hidden" />
        <div className="absolute bottom-0 left-1/2 size-72 -translate-x-1/2 rounded-full bg-wash-sun/15 blur-3xl motion-reduce:hidden" />
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
              inside a sans heading rather than as a second heading style.
            */}
            <Reveal as="h1" className="text-display-md leading-[1.02] text-foreground-strong">
              <span className="block font-sans text-[0.62em] tracking-tight text-muted">
                Hi, I&rsquo;m
              </span>
              <span className="mt-1 block">
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
    </section>
  )
}