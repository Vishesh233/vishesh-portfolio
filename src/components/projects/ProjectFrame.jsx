import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ProjectPlate } from './ProjectPlate.jsx'
import { cn } from '../../lib/utils.js'

/**
 * The visual stage a project's plate sits in.
 *
 * A PLATE, NOT A CARD
 * There is no drop shadow, no rounded corner and no translucent fill. The stage
 * is defined the way a print designer defines a mounted plate — a hairline on
 * two edges only, corner registration marks, and a colophon of metadata set
 * beneath it in mono. Depth comes from the artwork and from space, not from a
 * box drawn around it.
 *
 * The `top`/`bottom` hairlines extend edge-to-edge while the corner ticks sit
 * just inside them, which is what makes the frame read as a crop mark rather
 * than as a border.
 */
export function ProjectFrame({
  project,
  variant,
  ratio = 'aspect-[16/10]',
  className,
}) {
  const frameRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })

  /*
   * ±2% of the frame's own height. Deliberately tiny: the plate should feel as
   * though it sits *in* the page rather than sliding across it. Any larger and
   * the artwork drifts away from the type beside it, which reads as a mistake.
   * The frame itself never moves, so the hairline stays welded to the layout.
   */
  const drift = useTransform(scrollYProgress, [0, 1], ['-2%', '2%'])

  // The plate is drawn slightly larger than the frame and cropped, so drifting it
  // never exposes an empty edge inside the hairline.
  return (
    <figure
      ref={frameRef}
      className={cn('group relative flex flex-col', ratio, className)}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-surface">
        <motion.div
          className="absolute -inset-y-[6%] inset-x-0"
          style={prefersReducedMotion ? undefined : { y: drift }}
        >
          <ProjectPlate
            seed={project.id}
            variant={variant}
            className="h-full w-full"
          />
        </motion.div>

        {/* Registration ticks. Decorative, and always invisible to assistive tech
            because they carry no information the text does not already give. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-border-strong"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-border-strong"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-border-strong"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-border-strong"
        />
      </div>

      {/* Colophon. A printed plate carries its own caption block; this is that,
          and it repeats verified data rather than describing artwork. */}
      <figcaption className="flex items-center justify-between gap-4 border-t border-border pt-3 font-mono text-micro uppercase tracking-widest text-subtle">
        <span className="truncate">{project.category}</span>
        <span aria-hidden="true" className="h-px w-6 shrink-0 bg-border-strong" />
        <span className="shrink-0">
          {project.stack?.length ?? 0} Stack
        </span>
      </figcaption>
    </figure>
  )
}