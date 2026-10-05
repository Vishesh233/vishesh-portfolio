import { cn } from '../../lib/utils.js'

/**
 * Call-to-action link.
 *
 * THREE VARIANTS, because the hero and the project modal genuinely have three
 * different kinds of action. All share one editorial treatment — mono, small,
 * tracked out, modest radius — so a row of CTAs reads as a set rather than as
 * competing buttons.
 *
 * · `primary` — a coral fill. Reserved for the single most important action in
 *   a view, so the accent never stops meaning "this is the one".
 * · `ghost` — a hairline. Everything else, so it stays quiet.
 * · `quiet` — text plus an arrow, no box at all. For tertiary actions inside
 *   dense rows such as a modal footer.
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
        'transition-colors duration-200',
        isQuiet
          ? 'px-0 py-1 text-muted hover:text-accent-ink'
          : 'px-5 py-3',
        variant === 'primary' &&
          'bg-accent text-accent-on hover:bg-accent-hover',
        variant === 'ghost' &&
          'border border-border-strong text-foreground hover:border-accent hover:text-accent-ink',
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