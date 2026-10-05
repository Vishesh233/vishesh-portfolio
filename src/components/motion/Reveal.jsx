import { motion, useReducedMotion } from 'framer-motion'
import { sectionVariants, duration, easing } from '../../lib/motion.js'

/**
 * Scroll-triggered entrance wrapper.
 *
 * THE single decision point for `prefers-reduced-motion` in the UI layer.
 * Components using this never check the preference themselves — they ask for an
 * entrance and this component decides whether to animate it.
 *
 * When motion is reduced the element renders in its final state immediately
 * (`initial={false}`), rather than fading in with a shortened duration. That
 * matters for accessibility: a reduced-motion user should never wait on an
 * animation at all, and nothing should ever be hidden behind one.
 *
 * `viewport.once` means an element animates the first time it is seen and then
 * stops observing, which keeps long pages from animating on every scroll pass.
 */
export function Reveal({
  as = 'div',
  delay = 0,
  variants = sectionVariants,
  className,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

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
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ delay, duration: duration.slow, ease: easing.outExpo }}
      {...rest}
    >
      {children}
    </Component>
  )
}