import { motion, useReducedMotion } from 'framer-motion'
import { sectionVariants } from '../../lib/motion.js'

/**
 * Scroll-triggered entrance wrapper.
 *
 * THE single decision point for `prefers-reduced-motion` in the UI layer.
 * Components using this never check the preference themselves — they ask for an
 * entrance and this component decides whether to animate it.
 *
 * WHEN MOTION IS REDUCED
 * The element renders in its final state immediately, rather than fading in
 * with a shortened duration. A reduced-motion user should never wait on an
 * animation at all, and nothing should ever be hidden behind one.
 *
 * STARTING FROM A VISIBLE STATE
 * `sectionVariants.hidden` sits at opacity 0.94 with a 12px offset, not 0. Even
 * in the window between mount and the observer firing, the content is legible
 * and correctly placed — if JavaScript is slow, blocked or the element is
 * rendered by a crawler without motion, the reader sees a complete page rather
 * than a blank one. The animation reads as content settling into place, which
 * is also a far smaller visual commitment than a fade from nothing.
 *
 * `viewport.once` means an element animates the first time it is seen and then
 * stops observing, so a long page does not re-animate on every scroll pass.
 *
 * WHY A `delay` PROP AT ALL
 * Skills and Education render grids where every entry shares one variant set.
 * A per-item delay (40–50ms) sequences them so the eye tracks the grid's
 * order; the values stay below the point where each card reads as its own
 * separate animation, so the list still resolves as one gesture. The delay is
 * baked into the resolved `visible` variant rather than passed as a
 * component-level `transition`, so it travels with the variant definition and
 * cannot be lost to a transition the variant already carries — and it never
 * reaches the DOM. Under reduced motion the entrance (and its delay) is
 * skipped entirely: final state, immediately.
 */
export function Reveal({
  as = 'div',
  variants = sectionVariants,
  /** Seconds to wait before this element's entrance — grid stagger only. */
  delay,
  className,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  const resolvedVariants = delay
    ? {
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: { ...(variants.visible?.transition ?? {}), delay },
        },
      }
    : variants

  if (prefersReducedMotion) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    )
  }

  return (
    <Component
      className={className}
      variants={resolvedVariants}
      initial="hidden"
      whileInView="visible"
      // A negative bottom margin triggers the reveal slightly before the
      // element is fully on screen, so motion is already settling by the time
      // the reader looks at it.
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      {...rest}
    >
      {children}
    </Component>
  )
}