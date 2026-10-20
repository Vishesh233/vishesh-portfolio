import { forwardRef, useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ProjectImage } from '../ui/ProjectImage.jsx'

/**
 * One project, as a card that opens the detail modal.
 *
 * WHY A <button> AND NOT A LINK
 * A link promises a destination: it can be opened in a new tab, copied, and it
 * appears in the middle-click and long-press menus. This card goes nowhere —
 * it changes in-page state. Wrapping it in an <a href="#"> would be a lie that
 * also breaks middle-click, and a `div` with onClick would be unreachable by
 * keyboard. A real `<button type="button">` gets Enter, Space, focus order,
 * and the correct role announced for free.
 *
 * The button forwards its ref so the modal can return focus to the exact card
 * that opened it — without that, closing the modal drops focus on <body> and a
 * keyboard user has to tab back from the top of the document.
 *
 * THE CARD IS ONE BIG TARGET
 * The screenshot, the title and the body are all inside the button, so the
 * whole surface is clickable. Nested interactive elements are deliberately
 * absent: a link inside a button is invalid HTML and un-focusable.
 *
 * `sizes` matters here — the card is ~30rem wide on desktop but nearly full
 * width on a phone, and a wrong value would make the browser download the
 * largest candidate for every device.
 */
export const ProjectCard = forwardRef(function ProjectCard(
  { project, index = 0, onOpen },
  ref,
) {
  const prefersReducedMotion = useReducedMotion()
  const headingId = useId()

  // Drives the "View details" hint. Driven by state rather than a CSS-only
  // :hover so keyboard focus produces exactly the same affordance as a pointer.
  const [isActive, setIsActive] = useState(false)

  const showHint = isActive

  return (
    <motion.li
      // The list item is the grid cell; the button inside is the control.
      className="h-full"
      initial={prefersReducedMotion ? false : { opacity: 0.94, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        ref={ref}
        type="button"
        onClick={() => onOpen(project)}
        onHoverStart={() => setIsActive(true)}
        onHoverEnd={() => setIsActive(false)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        // Hover/focus elevation is the shared `.pop` treatment (utilities.css),
        // not a Framer transform: one implementation, with its own
        // hover-capable and reduced-motion gates, identical everywhere.
        className={[
          'group pop card-spine flex h-full w-full flex-col overflow-hidden rounded-md border bg-surface text-left',
          'border-border',
        ].join(' ')}
      >
        {/*
          Screenshot. Fixed-ratio box with object-cover and object-position:top,
          so all three cards align to the same height even though the source
          screenshots have three different aspect ratios, and the top of each
          UI (the part that identifies the app) is always what is visible.
          A teal wash keeps photography inside the palette.
        */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background">
          <div aria-hidden="true" className="absolute inset-0 z-10 bg-accent/10 mix-blend-multiply dark:bg-accent/20 dark:mix-blend-overlay" />
          <ProjectImage
            name={project.image}
            alt={project.imageAlt}
            sizes="(min-width: 1024px) 30rem, (min-width: 640px) 45vw, 92vw"
            className="size-full"
            imgClassName="object-cover object-top"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6 pl-7">
          {/* Case-study numeral + category: the entry's identity row. */}
          <span className="flex items-center gap-2 font-mono text-micro tracking-widest text-gilt uppercase">
            <span aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px w-5 bg-secondary/70" />
            {project.category}
          </span>

          <div className="flex items-start justify-between gap-3">
            <h3 id={headingId} className="text-title text-foreground-strong">
              {project.name}
            </h3>

            {/* The affordance. Always in the DOM so the row does not reflow
                when it appears; only its visibility changes. */}
            <span
              aria-hidden="true"
              className={[
                'shrink-0 whitespace-nowrap font-mono text-micro tracking-tight text-accent-ink',
                'transition-opacity duration-200',
                showHint ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
            >
              View details →
            </span>
          </div>

          {/* Two lines, clamped so the three cards stay the same height
              regardless of description length. */}
          <p className="line-clamp-2 text-body-sm text-muted">
            {project.summary}
          </p>

          {/*
            Every tag in the stack is listed. InterviewPilot's approved stack is
            seven items and truncating it would hide the Gemini API entry, which
            is the single most distinguishing fact about that project. Quiet
            mono tags with gold separators — no boxes.
          */}
          <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="font-mono text-micro text-muted-strong"
              >
                <span aria-hidden="true" className="text-gilt mr-1.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.button>
    </motion.li>
  )
})