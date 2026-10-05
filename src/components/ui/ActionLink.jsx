import { cn } from '../../lib/utils.js'

/**
 * Call-to-action link.
 *
 * Two variants only, because the hero needs a primary and a secondary and
 * nothing more. Both share the editorial treatment — mono, uppercase, tracked
 * out — so a row of CTAs reads as a set rather than as competing buttons.
 *
 * `primary` is an ember fill and is reserved for the single most important
 * action on a view. `ghost` is a hairline and is used for everything else, so
 * the accent never stops meaning "this is the one".
 *
 * Renders an anchor, since both destinations are on-page sections. Focus and
 * hover styling come from the global base layer, so they are consistent here.
 */
export function ActionLink({
  href,
  children,
  variant = 'ghost',
  className,
  ...rest
}) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-3 rounded-sm px-5 py-3 font-mono text-caption uppercase tracking-wide',
        'transition-colors duration-300',
        variant === 'primary'
          ? 'bg-accent text-accent-on hover:bg-accent-hover'
          : 'border border-border-strong text-foreground hover:border-accent hover:text-accent',
        className,
      )}
      {...rest}
    >
      {children}

      {/* Arrow nudges on hover only — a small confirmation of direction. */}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  )
}