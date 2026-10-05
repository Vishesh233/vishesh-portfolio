import { cn } from '../../lib/utils.js'

/**
 * Responsive page gutters at a fixed max width.
 *
 * THE primary layout primitive. Every section renders its content inside a
 * Container so horizontal rhythm is defined once and cannot be re-decided per
 * section. The optional `bleed` prop lets a full-width element (an art-directed
 * image or 3D canvas) escape the max width while its siblings stay aligned.
 */

const widths = {
  narrow: 'max-w-narrow',
  content: 'max-w-content',
  wide: 'max-w-wide',
  full: 'max-w-none',
}

export function Container({
  as: Tag = 'div',
  width = 'content',
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn('mx-auto w-full px-gutter', widths[width], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}