import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  createLattice,
  projectPoint,
  waveHeight,
  readTokenColor,
  rgba,
  damp,
} from '../../lib/lattice.js'
import { observeVisibility } from '../../lib/utils.js'

/**
 * The hero's 3D element: a slowly rotating wireframe lattice whose surface
 * undulates and tilts toward the pointer.
 *
 * WHY THIS AND NOT A SPINNING CUBE
 * A wireframe plane belongs to the art direction — it shares the hairline
 * language of the editorial rules and the muted geometry of the 3D brief,
 * whereas a solid primitive would read as a stock demo. It also has a job:
 * it establishes depth behind the headline without competing with it.
 *
 * PERFORMANCE
 * · Renders on a 2D canvas, so there is no WebGL context to lose and no GPU
 *   memory to leak.
 * · Device pixel ratio is capped at 2 — beyond that the extra pixels are not
 *   visible on the hairlines this draws, and they are expensive.
 * · The loop is suspended whenever the hero scrolls out of view, the tab is
 *   hidden, or the component unmounts. A hero is on screen for a few seconds,
 *   so this is the difference between a battery drain and not.
 * · Under `prefers-reduced-motion` a single static frame is drawn and the loop
 *   never starts, so the composition is still complete without animating.
 */
export function HeroLattice({ className = '' }) {
  const canvasRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    // Tokens are read from CSS so the lattice follows the design system if the
    // palette is ever retuned, rather than hard-coding colours here.
    const lineColor = readTokenColor('--color-bone-200', [207, 204, 197])
    const crestColor = readTokenColor('--color-ember-400', [229, 146, 79])

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches

    // Fewer segments on touch devices: the lattice is decorative there, and a
    // coarse pointer cannot produce the tilt that justifies the density.
    const { points, segments } = createLattice({
      resolution: reduceMotion ? 10 : isCoarsePointer ? 13 : 19,
      extent: 2.5,
    })

    const view = {
      yaw: 0,
      pitch: 0.48,
      distance: 5.8,
      // Focal length as a fraction of canvas height. Kept modest so the plane
      // occupies its region without crowding the space around it.
      focal: 0.54,
    }

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const projection = new Float32Array((points.length / 3) * 4)

    let width = 0
    let height = 0
    let frame = 0
    let elapsed = 0
    let lastTime = 0
    let running = false
    let isVisible = true

/** Matches the backing store to the element's box, capped at 2x DPR. */
    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = rect.width
      height = rect.height

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /** Draws one frame of the lattice at the given time. */
    function draw(time) {
      context.clearRect(0, 0, width, height)

      // Pointer input is damped rather than applied directly, so the surface
      // eases toward the cursor instead of snapping to it.
      pointer.x = damp(pointer.x, pointer.targetX, 0.045)
      pointer.y = damp(pointer.y, pointer.targetY, 0.045)

      view.yaw = 0.42 + elapsed * 0.035 + pointer.x * 0.42
      view.pitch = 0.46 + pointer.y * 0.26

      const count = points.length / 3

      for (let index = 0; index < count; index++) {
        const x = points[index * 3]
        const z = points[index * 3 + 2]
        const y = waveHeight(x, z, elapsed)

        const projected = projectPoint(x, y, z, view, width, height)
        const offset = index * 4

        if (!projected) {
          projection[offset + 2] = 0
          continue
        }

        projection[offset] = projected.x
        projection[offset + 1] = projected.y
        projection[offset + 2] = 1
        projection[offset + 3] = y
      }

      context.lineWidth = 1

      for (let index = 0; index < segments.length; index += 2) {
        const a = segments[index]
        const b = segments[index + 1]

        if (projection[a * 4 + 2] === 0 || projection[b * 4 + 2] === 0) continue

        const ax = projection[a * 4]
        const ay = projection[a * 4 + 1]
        const bx = projection[b * 4]
        const by = projection[b * 4 + 1]

        // Lines fade with distance, which reads as depth without needing a
        // volumetric effect — and it keeps the far edge from competing with
        // the headline.
        const depth = (projection[a * 4 + 3] + projection[b * 4 + 3]) / 2 + 1
        const crest = Math.min(Math.abs(projection[a * 4 + 3]), 0.42) / 0.42

        const opacity = 0.1 + depth * 0.16 + crest * 0.22
        const color = crest > 0.55 ? crestColor : lineColor

        context.strokeStyle = rgba(color, Math.min(opacity, 0.46))
        context.beginPath()
        context.moveTo(ax, ay)
        context.lineTo(bx, by)
        context.stroke()
      }

      lastTime = time
    }

    function loop(time) {
      if (!running) return

      // Clamp the delta so a backgrounded tab does not resume with a huge jump.
      const delta = Math.min((time - lastTime) / 1000, 0.05)
      elapsed += delta

      draw(time)
      frame = requestAnimationFrame(loop)
    }

    function start() {
      if (running || reduceMotion) return
      running = true
      lastTime = performance.now()
      frame = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      cancelAnimationFrame(frame)
    }

    function handlePointerMove(event) {
      // Normalised to -1..1 from the centre of the viewport.
      pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.targetY = (event.clientY / window.innerHeight - 0.5) * -2
    }

    function handleVisibility() {
      if (document.hidden) stop()
      else if (isVisible) start()
    }

    function handleResize() {
      resize()
      if (reduceMotion) draw(performance.now())
    }

    resize()
    draw(performance.now())

    if (reduceMotion) {
      // Static frame only. The composition is complete; nothing animates.
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }

    const unobserve = observeVisibility(canvas, { threshold: 0 })

    function handleVisibilityChange(event) {
      isVisible = event.detail.isVisible
      if (isVisible && !document.hidden) start()
      else stop()
    }

    canvas.addEventListener('visibilitychange', handleVisibilityChange)

    if (isCoarsePointer) {
      // Touch devices get the ambient drift without pointer tracking.
      start()
    } else {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      start()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('resize', handleResize)

    return () => {
      stop()
      unobserve()
      canvas.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  )
}