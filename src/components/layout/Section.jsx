import { cn } from '../../lib/utils.js'

/**
 * A full-bleed page section.
 *
 * Owns the vertical rhythm and the anchor offset for scroll-based navigation,
 * so any section can be linked to (`#projects`) and it will never land hidden
 * beneath the sticky header. `deferred` opts the section into
 * `content-visibility: auto`, letting the browser skip rendering work while the
 * section is off-screen.
 *
 * `labelledBy` names the id of the element that labels this section — normally
 * its own `<h2>`. That produces a real accessible name, so a screen reader
 * announcing "region" says which region it is, rather than just "region".
 */
export function Section({
  as: Tag = 'section',
  id,
  labelledBy,
  deferred = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn('section', deferred && 'defer', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}