/**
 * Motion tokens and shared variants.
 *
 * The Framer Motion counterparts of the `--ease-*` and duration values in
 * src/styles/tokens.css. Keeping both in one language means CSS transitions and
 * JS animations cannot drift apart.
 *
 * MOTION PHILOSOPHY
 * · Motion reveals structure; it never decorates. Every animation here either
 *   orients the eye (entrance), confirms an action (press) or preserves
 *   continuity (layout). Nothing loops, bounces or floats idly.
 * · Durations are unhurried. 600–800ms for entrances, ~200ms for feedback.
 * · Everything routes through `useMotion()` so `prefers-reduced-motion` is a
 *   single decision point rather than a check scattered across components.
 */

/** Mirrors `--ease-*` in tokens.css. */
export const easing = {
  standard: [0.2, 0, 0, 1],
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
}

/** Duration scale in seconds (Framer Motion's unit). */
export const duration = {
  instant: 0.15,
  fast: 0.25,
  base: 0.45,
  slow: 0.7,
  deliberate: 0.9,
}

/** Default transition for entrances. */
export const enterTransition = {
  duration: duration.slow,
  ease: easing.outExpo,
}

/** Default transition for hover/press feedback — noticeably quicker. */
export const feedbackTransition = {
  duration: duration.fast,
  ease: easing.outQuart,
}

/**
 * Section entrance.
 *
 * Starts from a VISIBLE state on purpose: opacity 0.72 and a 12px offset, not 0.
 * The page is therefore complete and legible at every instant — before the
 * observer fires, if motion never runs at all, and while the element is still
 * scrolling into view. A reveal that begins from nothing risks leaving a blank
 * block on the page if anything interrupts it, and a 12px settle reads as
 * "content arriving" rather than as an animation being performed.
 */
export const sectionVariants = {
  hidden: { opacity: 0.72, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
}

/** Fades without translating. For text that should not appear to move. */
export const fadeVariants = {
  hidden: { opacity: 0.72 },
  visible: { opacity: 1, transition: enterTransition },
}

/**
 * Parent for staggered children. `staggerChildren` is small (0.08s) so a list
 * resolves as one gesture rather than a cascade of separate animations.
 */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
})

/**
 * The reduced-motion variants. Both resolve to `visible` with no transform
 * and no opacity change, so content is present immediately and nothing is
 * hidden behind an animation that will not run.
 */
export const reducedVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}