import { cn } from '../../lib/utils.js'

/**
 * A full-bleed page section.
 *
 * Owns the vertical rhythm and the anchor offset for scroll-based navigation,
 * so any section can be linked to (`#projects`) and it will never land hidden
 * beneath the sticky header. `deferred` opts the section into
 * `content-visibility: auto`, letting the browser skip rendering work while the
 * section is off-screen — important once sections carry 3D.
 */
export function Section({
  as: Tag = 'section',
  id,
  label,
  deferred = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      id={id}
      aria-label={label}
      className={cn('section', deferred && 'defer', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}