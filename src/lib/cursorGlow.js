/**
 * The cursor light.
 *
 * WHAT IT DOES
 * While the pointer is inside a card/box, the soft warm radial in the box's
 * `::before` (utilities.css) tracks it. This module is the JavaScript half:
 * it writes the `--mx`/`--my` custom properties that gradient reads.
 *
 * HOW, AND WHY THIS SHAPE
 * · Delegated `pointerover`/`pointerout` on the document find the hovered box
 *   through `closest()`, so every surface carrying `.pop`, `.pop-strong`,
 *   `.card` or `.panel` gets the light with no per-component hook — markup
 *   and effect cannot drift apart.
 * · The `pointermove` listener binds to the hovered element ONLY, never the
 *   window: moving the pointer over the rest of the page does no work, and
 *   leaving the box tears the listener down again.
 * · Writes are rAF-throttled — at most one style write per frame, carrying
 *   the latest coordinates. Pointer events can fire far faster than frames,
 *   and a setProperty per event would schedule work nobody can see.
 * · The rectangle is read inside the frame against the element itself, so
 *   coordinates stay correct if the page scrolls under a stationary pointer.
 *
 * GATES (mirrored in utilities.css)
 * · `(hover: hover)` — no light on touch, where `:hover` would stick to the
 *   last box tapped.
 * · `prefers-reduced-motion` — the light stays a static centred glow: any
 *   written `--mx`/`--my` are removed and no new ones are produced, so the
 *   CSS default (`50% 50%`) is what renders.
 *
 * Returns a cleanup function that detaches everything this call bound.
 */

/** Every surface the glow belongs to — the same set utilities.css styles. */
const GLOW_SELECTOR = '.pop, .pop-strong, .card, .panel'

export function installCursorGlow() {
  if (typeof document === 'undefined') return () => {}

  const hoverCapable = window.matchMedia('(hover: hover)')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  /** The box the light currently belongs to, or null. */
  let active = null
  /** Pending animation frame id, or 0 when nothing is scheduled. */
  let frame = 0
  let pointerX = 0
  let pointerY = 0

  /** The one write per frame. Reads the rect here so scrolling stays correct. */
  const write = () => {
    frame = 0
    if (!active) return

    const rect = active.getBoundingClientRect()
    active.style.setProperty('--mx', `${pointerX - rect.left}px`)
    active.style.setProperty('--my', `${pointerY - rect.top}px`)
  }

  const handleMove = (event) => {
    if (!active) return

    if (reduceMotion.matches) {
      // Static glow: fall back to the CSS default (the centre) and stop.
      active.style.removeProperty('--mx')
      active.style.removeProperty('--my')
      return
    }

    if (!hoverCapable.matches) return

    pointerX = event.clientX
    pointerY = event.clientY

    // rAF-throttle: one write per frame, always with the latest position.
    if (frame) return
    frame = requestAnimationFrame(write)
  }

  const detach = () => {
    if (!active) return

    active.removeEventListener('pointermove', handleMove)
    active = null

    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  const handleOver = (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const box = target.closest(GLOW_SELECTOR)
    if (!box) return

    // Still inside the same box — pointerover fires again per child entered.
    if (box === active) return
    // Moving deeper into a nested box keeps the light on the OUTER one, so
    // the glow beneath the pointer never freezes mid-box.
    if (active && active.contains(box)) return

    detach()

    active = box
    active.addEventListener('pointermove', handleMove)
  }

  const handleOut = (event) => {
    if (!active) return

    // Moving between children of the same box is not a leave.
    const entered = event.relatedTarget
    if (entered instanceof Node && active.contains(entered)) return

    detach()
  }

  document.addEventListener('pointerover', handleOver)
  document.addEventListener('pointerout', handleOut)

  return () => {
    detach()
    document.removeEventListener('pointerover', handleOver)
    document.removeEventListener('pointerout', handleOut)
  }
}