import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ProjectImage } from '../ui/ProjectImage.jsx'
import { CloseIcon, GithubIcon, ExternalIcon } from '../ui/Icons.jsx'

/** Every element that can hold focus inside the dialog. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * The project detail dialog.
 *
 * ACCESSIBILITY CONTRACT
 * · role="dialog" + aria-modal="true" tell assistive tech this is a modal layer.
 * · aria-labelledby points at the project title, so the dialog is announced as
 *   "LibVerse, dialog" rather than an unlabelled popup.
 * · Focus moves into the dialog on open and returns to the originating card on
 *   close, so a keyboard user is never stranded at the top of the document.
 * · Tab is trapped: focus cycles within the dialog and cannot reach the page
 *   behind it.
 * · Escape closes.
 *
 * SCROLL LOCK
 * `overflow: hidden` on <body> alone is not enough — on desktop that removes
 * the scrollbar and the page jumps sideways as the layout widens. A matching
 * `padding-right` equal to the scrollbar width compensates. Previous inline
 * values are captured and restored, so a second open cannot compound them.
 *
 * CLICK OUTSIDE
 * Bound on the backdrop element itself rather than the document, so a click
 * that starts inside the panel and ends outside does not close the dialog —
 * that pattern otherwise closes the modal when a visitor finishes selecting
 * text and lifts the pointer.
 *
 * PORTAL
 * Rendered into document.body so it is never clipped by an ancestor with
 * `overflow: hidden` or its own stacking context, and so it paints above the
 * sticky header.
 */
export function ProjectModal(props) {
  const panelRef = useRef(null)

  const { onClose } = props

  // Focus trap + Escape.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    /** Everything focusable right now, in DOM order. */
    const focusable = () =>
      Array.from(panel.querySelectorAll(FOCUSABLE))

    // Move focus into the dialog. The close button is the first focusable
    // element, so focus lands somewhere meaningful rather than on the panel
    // itself, which would need a tabindex and add a phantom tab stop.
    focusable()[0]?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      // Wrap at both ends. Without preventDefault on the Shift case,
      // Shift+Tab from the first element escapes backwards into the page.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    // Capture phase, so the trap wins over anything the page itself binds.
    document.addEventListener('keydown', handleKeyDown, true)

    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [onClose])

  // Scroll lock, with scrollbar-width compensation.
  useEffect(() => {
    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight

    const scrollbar = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [])

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) onClose()
    },
    [onClose],
  )

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-modal flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm sm:p-6 lg:p-8"
    >
      <ProjectModalPanel {...props} panelRef={panelRef} />
    </div>,
    document.body,
  )
}

/**
 * The dialog's contents, with no portal and no side effects.
 *
 * SEPARATED FROM THE BEHAVIOUR ON PURPOSE
 * `createPortal` needs a DOM, so a portalled dialog renders as `null` under
 * server-side rendering or in a plain Node test — meaning its markup, its
 * accessible name and its conditional buttons could not be verified at all.
 * Keeping the presentational half here makes it renderable on its own, so the
 * content can be asserted in isolation and the panel has no opinion about how
 * it was mounted.
 *
 * `panelRef` is threaded in rather than created here so the focus trap in the
 * wrapper and the element it queries stay the same object.
 */
export function ProjectModalPanel({
  project,
  previousProject,
  nextProject,
  onClose,
  onPrevious,
  onNext,
  panelRef,
}) {
  const prefersReducedMotion = useReducedMotion()

  // Opacity-only when motion is reduced; a short rise otherwise.
  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.99 },
      }

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-title-${project.id}`}
      {...panelMotion}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={[
        // `panel` is the dialog's box treatment: it opts the surface into the
        // shared cursor light and border glow (utilities.css) without the
        // hover-pop lift — a modal must not move under the pointer while its
        // contents are being read or scrolled.
        'panel relative my-auto w-full max-w-4xl overflow-hidden rounded-md',
        'border border-border bg-surface shadow-lift',
      ].join(' ')}
    >
        {/* Screenshot banner, with the close button over it. */}
        <div className="relative aspect-[16/8] w-full overflow-hidden border-b border-border bg-background">
          <div aria-hidden="true" className="absolute inset-0 z-10 bg-accent/10 mix-blend-multiply dark:bg-accent/20 dark:mix-blend-overlay" />
          <ProjectImage
            name={project.image}
            alt={project.imageAlt}
            sizes="(min-width: 1024px) 56rem, 92vw"
            className="size-full"
            imgClassName="object-cover object-top"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={[
              'absolute right-3 top-3 grid size-9 place-items-center rounded-sm',
              'border border-border bg-background/90 text-muted-strong backdrop-blur',
              'transition-colors duration-200 hover:border-accent hover:text-accent-ink',
            ].join(' ')}
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {/* Scrollable body. */}
        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8">
          <span className="flex items-center gap-2 font-mono text-micro tracking-widest text-gilt uppercase">
            <span aria-hidden="true" className="h-px w-5 bg-secondary/70" />
            {project.category}
          </span>

          <h3
            id={`project-title-${project.id}`}
            className="mt-3 text-display-sm text-foreground-strong"
          >
            {project.name}
          </h3>

          <p className="mt-2 text-body-sm text-muted">{project.tagline}</p>

          <div className="mt-6">
            <h4 className="flex items-center gap-2 font-mono text-micro tracking-widest text-accent-ink uppercase">
              <span aria-hidden="true" className="h-px w-4 bg-accent/70" />
              Overview
            </h4>
            <p className="mt-2 max-w-[68ch] text-body text-muted-strong">
              {project.overview}
            </p>
          </div>

          <div className="mt-7">
            <h4 className="flex items-center gap-2 font-mono text-micro tracking-widest text-accent-ink uppercase">
              <span aria-hidden="true" className="h-px w-4 bg-accent/70" />
              Key features
            </h4>
            <ul className="mt-3 flex flex-col gap-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-body-sm text-muted-strong"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7">
            <h4 className="flex items-center gap-2 font-mono text-micro tracking-widest text-accent-ink uppercase">
              <span aria-hidden="true" className="h-px w-4 bg-accent/70" />
              Tech stack
            </h4>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="font-mono text-caption text-muted-strong"
                >
                  <span aria-hidden="true" className="text-gilt mr-1.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {project.notes && (
            <p className="mt-6 border-l-2 border-secondary/60 pl-4 text-body-sm text-subtle">
              {project.notes}
            </p>
          )}
          {/* ACTIONS */}
          <div className="mt-8 flex flex-wrap items-end gap-4 border-t border-border pt-6">
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'pop-strong inline-flex items-center gap-2 rounded-sm border border-border-strong',
                'px-5 py-3 font-mono text-caption text-foreground',
                'transition-colors duration-200 hover:text-accent-ink',
              ].join(' ')}
            >
              <GithubIcon className="size-4" />
              View Code
              <ExternalIcon className="size-3.5 opacity-70" />
            </a>

            {/*
              Live Demo is rendered ONLY when the project has a verified live
              URL. A project without one emits no button at all rather than a
              disabled one — a greyed-out control still promises something.
            */}
            {project.liveUrl && (
              <div className="flex flex-col gap-1">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'pop-strong inline-flex items-center gap-2 rounded-sm px-5 py-3',
                    'bg-accent font-mono text-caption text-accent-on',
                    'transition-colors duration-200 hover:bg-accent-hover',
                  ].join(' ')}
                >
                  Live Demo
                  <ExternalIcon className="size-3.5 opacity-80" />
                </a>

                {project.liveUrlNote && (
                  <span className="font-mono text-micro text-subtle">
                    {project.liveUrlNote}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PREV / NEXT */}
        <div className="flex items-stretch justify-between border-t border-border">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!previousProject}
            className={[
              'group flex flex-1 items-center gap-3 px-6 py-4 text-left',
              'transition-colors duration-200',
              previousProject
                ? 'hover:bg-background'
                : 'cursor-not-allowed opacity-40',
            ].join(' ')}
          >
            <span aria-hidden="true" className="text-accent-ink">
              &larr;
            </span>
            <span className="flex flex-col">
              <span className="font-mono text-micro tracking-widest text-subtle uppercase">
                Previous
              </span>
              <span className="font-mono text-caption text-foreground-strong">
                {previousProject?.name}
              </span>
            </span>
          </button>

          <span aria-hidden="true" className="w-px bg-border" />

          <button
            type="button"
            onClick={onNext}
            disabled={!nextProject}
            className={[
              'group flex flex-1 items-center justify-end gap-3 px-6 py-4 text-right',
              'transition-colors duration-200',
              nextProject
                ? 'hover:bg-background'
                : 'cursor-not-allowed opacity-40',
            ].join(' ')}
          >
            <span className="flex flex-col">
              <span className="font-mono text-micro tracking-widest text-subtle uppercase">
                Next
              </span>
              <span className="font-mono text-caption text-foreground-strong">
                {nextProject?.name}
              </span>
            </span>
            <span aria-hidden="true" className="text-accent-ink">
              &rarr;
            </span>
          </button>
        </div>
    </motion.div>
  )
}