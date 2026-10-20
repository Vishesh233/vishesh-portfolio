import { cn } from '../../lib/utils.js'

/**
 * Call-to-action link.
 *
 * THREE VARIANTS, because the hero and the project modal genuinely have three
 * different kinds of action. All share one editorial treatment — mono, small,
 * tracked out, modest radius — so a row of CTAs reads as a set rather than as
 * competing buttons.
 *
 * · `primary` — an accent fill (blue in light, teal in dark) with the
 *   theme's accent-on ink. Reserved for the single most important action
 *   in a view, so the accent never stops meaning "this is the one". Gold
 *   never fills — it stays a detail.
 * · `ghost` — a hairline. Everything else, so it stays quiet.
 * · `quiet` — text plus an arrow, no box at all. For tertiary actions inside
 *   dense rows such as a modal footer.
 *
 * PRESS FEEDBACK: every variant dips to 98% while `:active`, gated behind
 * `motion-safe:` so reduced-motion readers keep a static press. A click
 * should feel acknowledged before the destination resolves. Boxed variants
 * also carry the shared hover-pop (`pop-strong` in utilities.css): lift,
 * accent hairline and shadow, gated on hover-capable pointers and
 * neutralised under `prefers-reduced-motion`. The quiet variant
 * stays colour-only, because a text link moving fights the reading path.
 *
 * RENDERS AN ANCHOR because every destination here is a real URL: an on-page
 * section, an external site, or a file to download. External and file targets
 * are the caller's decision, expressed through the `external` and `download`
 * props rather than by hand-writing `target` and `rel` each time.
 */
export function ActionLink({
  href,
  children,
  variant = 'ghost',
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  external = false,
  /** Triggers a download; `value` is the saved filename. */
  download,
  /**
   * A node rendered in the trailing slot — a real icon rather than the default
   * arrow. Supplied by the caller so this component stays free of icon imports.
   */
  icon,
  /** Set false when `icon` already fills the trailing slot. */
  arrow = true,
  className,
  ...rest
}) {
  const isQuiet = variant === 'quiet'

  return (
    <a
      href={href}
      download={download}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group inline-flex items-center gap-2 rounded-sm font-mono text-caption',
        // `transition` (all relevant properties, not just colour) so the press
        // scale below animates as well as the hover colour change.
        'transition duration-200',
        isQuiet
          ? 'px-0 py-1 text-muted hover:text-accent-ink'
          : 'pop-strong px-5 py-3 motion-safe:active:scale-[0.98]',
        variant === 'primary' &&
          'bg-accent text-accent-on hover:bg-accent-hover',
        variant === 'ghost' &&
          'border border-border-strong text-foreground hover:text-accent-ink',
        className,
      )}
      {...rest}
    >
      {children}

      {/* Exactly one trailing mark, never two: a supplied icon replaces the
          default arrow rather than sitting beside it. */}
      {icon ??
        (arrow ? (
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        ) : null)}
    </a>
  )
}