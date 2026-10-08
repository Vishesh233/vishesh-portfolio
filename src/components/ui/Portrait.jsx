import { useEffect, useState } from 'react'
import { profile } from '../../data/site.js'

/**
 * The portrait, in either a circular or a rectangular frame.
 *
 * TWO JOBS
 * 1. Render the photograph when one exists.
 * 2. Fall back to an identity monogram plate when it does not, so the layout
 *    is never left with an empty hole. Both call sites get this for free — no
 *    caller branches on whether a photo was supplied.
 *
 * WHY THE IMAGE IS LAZY-LOADED BUT STILL EAGER IN THE HERO
 * `loading="eager"` because this is above the fold: lazy-loading it would delay
 * the single most prominent image on the page. `decoding="async"` still lets the
 * browser decode off the main thread. `width`/`height` come from the data file
 * and match the file on disk, so the box is reserved and the page does not
 * shift when the image arrives.
 *
 * THE RING
 * A gradient ring drawn as a padded wrapper rather than a border, because
 * `border-image` with a gradient needs a fallback for every engine and this
 * needs none — it is just a gradient background showing through a 3px gap.
 * The ring runs the theme's identity trio — blue → teal → lavender in
 * light, teal → lavender → blue in dark — so no corner is a dead flat
 * spot, yet nothing reads neon.
 *
 * The glow is a sibling behind the frame rather than a shadow on it, because
 * a blurred coloured div can be tuned independently of the ring and does not
 * inherit the card's box-shadow. The wash token resolves to a pastel blue
 * in the light theme and a luminous blue in the dark one.
 */
export function Portrait({
  shape = 'circle',
  size = 'w-64 sm:w-72 lg:w-80',
  className = '',
  priority = false,
}) {
  const [source, setSource] = useState(null)

  // Resolve the lazy import once on mount. Kept in state rather than awaited
  // during render so the component never suspends and never blocks first paint.
  useEffect(() => {
    let active = true

    if (!profile.image) return

    profile.image()
      .then((module) => {
        if (!active) return
        // Vite asset imports resolve to a URL string as the default export
        // (not `{ src }` — that shape only exists for imported picture
        // metadata). Accept either so the photo actually renders.
        const resolved =
          typeof module.default === 'string'
            ? module.default
            : (module.default?.src ?? null)
        setSource(resolved)
      })
      .catch(() => {
        // A failed import is not an error worth surfacing — the monogram is a
        // complete, intentional treatment, so failing over to it is correct.
        if (active) setSource(null)
      })

    return () => {
      active = false
    }
  }, [])

  const isCircle = shape === 'circle'
  const radius = isCircle ? 'rounded-full' : 'rounded-md'

  if (!source) {
    return <Monogram shape={shape} size={size} className={className} />
  }

  return (
    <div className={['relative', size, className].filter(Boolean).join(' ')}>
      {/* Soft blue glow. Decorative, so it never reaches assistive tech. */}
      <div
        aria-hidden="true"
        className={`absolute -inset-5 ${radius} bg-wash-blue/45 blur-2xl motion-reduce:hidden`}
      />

      {/* Gradient ring: a gradient plate with the photo inset over it. */}
      <div
        className={`ring-identity relative p-[3px] ${radius}`}
      >
        <div className={`overflow-hidden ${radius} bg-surface`}>
          <img
            src={source}
            alt="Vishesh Khanna"
            width={profile.width}
            height={profile.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="size-full object-cover object-[center_top]"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Monogram fallback.
 *
 * Not a placeholder for a missing asset — it is a deliberate typographic
 * treatment in its own right, built from the same accent ramp as the ring it
 * replaces so the composition holds together either way.
 */
function Monogram({ shape, size, className }) {
  const isCircle = shape === 'circle'
  const radius = isCircle ? 'rounded-full' : 'rounded-md'

  return (
    <div className={['relative', size, className].filter(Boolean).join(' ')}>
      <div
        aria-hidden="true"
        className={`absolute -inset-5 ${radius} bg-wash-blue/45 blur-2xl motion-reduce:hidden`}
      />

      <div
        className={`plate-identity relative grid size-full place-items-center ${radius} text-accent-on`}
      >
        <span
          className={`font-mono tracking-tight ${
            isCircle ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-7xl'
          }`}
        >
          {profile.monogram}
        </span>
      </div>

      {/* The name is announced even though no image carries it. */}
      <span className="sr-only">{profile.alt}</span>
    </div>
  )
}