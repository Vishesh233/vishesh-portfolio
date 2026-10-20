import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installCursorGlow } from './cursorGlow.js'

/**
 * The cursor light's contract:
 *   · `--mx`/`--my` are written on the hovered box only, in box-relative px,
 *     at most once per animation frame;
 *   · moving within a box does not rebind, leaving a box detaches, and a
 *     nested box never steals the light from its parent;
 *   · neither `(hover: hover)` nor `prefers-reduced-motion` lets a value
 *     through — reduced motion actively clears any that exist, which is what
 *     makes the CSS default (a static centred glow) the rendered state.
 *
 * matchMedia is stubbed per test because the module reads `.matches` live on
 * every pointermove; jsdom's shared stub always answers false, which would
 * make the "writes" case untestable.
 */
describe('installCursorGlow', () => {
  let uninstall
  let box
  /** Live media state — the module captures its MediaQueryList once, at
      install, so the stubs must answer from a mutable source. */
  let media
  const originalMatchMedia = window.matchMedia

  function stubMedia({ hover, reduce }) {
    media = { hover, reduce }
    window.matchMedia = (query) => ({
      get matches() {
        return query.includes('hover') ? media.hover : media.reduce
      },
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })
  }

  /** jsdom has no layout: hand the box a fixed rect to compute against. */
  function stubRect(element, left, top) {
    element.getBoundingClientRect = () => ({
      left,
      top,
      right: left + 300,
      bottom: top + 200,
      width: 300,
      height: 200,
      x: left,
      y: top,
      toJSON: () => ({}),
    })
  }

  /** Resolves after any frame this test has already scheduled has run. */
  const nextFrame = () =>
    new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })

  beforeEach(() => {
    stubMedia({ hover: true, reduce: false })

    box = document.createElement('div')
    box.className = 'card pop'
    stubRect(box, 100, 50)
    document.body.append(box)

    uninstall = installCursorGlow()
  })

  afterEach(() => {
    uninstall()
    box.remove()
    window.matchMedia = originalMatchMedia
  })

  it('writes --mx/--my on the hovered box, throttled to one frame', async () => {
    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))

    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 130, clientY: 80 }),
    )
    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 160, clientY: 110 }),
    )

    await nextFrame()

    // Latest coordinates win; the first move of the frame is not written.
    expect(box.style.getPropertyValue('--mx')).toBe('60px')
    expect(box.style.getPropertyValue('--my')).toBe('60px')
  })

  it('binds pointermove to the hovered element only', async () => {
    const bystander = document.createElement('div')
    document.body.append(bystander)

    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    bystander.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 999, clientY: 999 }),
    )

    await nextFrame()

    expect(box.style.getPropertyValue('--mx')).toBe('')
    expect(bystander.style.getPropertyValue('--mx')).toBe('')

    bystander.remove()
  })

  it('keeps the light on the outer box when the pointer enters a nested one', async () => {
    const chip = document.createElement('span')
    chip.className = 'pop-strong'
    stubRect(chip, 100, 50)
    box.append(chip)

    // Land directly on the nested box: it becomes the light's home…
    chip.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    chip.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 120, clientY: 70 }),
    )
    await nextFrame()
    expect(chip.style.getPropertyValue('--mx')).toBe('20px')

    // …but moving onto the parent rebinds, so the child never freezes mid-
    // hover: pointerout(child) then pointerover(parent), as the browser
    // fires them when the pointer crosses between the two.
    chip.dispatchEvent(
      new MouseEvent('pointerout', { bubbles: true, relatedTarget: box }),
    )
    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 250, clientY: 150 }),
    )
    await nextFrame()

    expect(box.style.getPropertyValue('--mx')).toBe('150px')
    expect(chip.style.getPropertyValue('--mx')).toBe('20px')

    chip.remove()
  })

  it('detaches on leave, so later pointer movement writes nothing', async () => {
    const outside = document.createElement('div')
    document.body.append(outside)

    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 140, clientY: 90 }),
    )
    await nextFrame()
    expect(box.style.getPropertyValue('--mx')).toBe('40px')

    box.dispatchEvent(
      new MouseEvent('pointerout', { bubbles: true, relatedTarget: outside }),
    )
    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 200, clientY: 200 }),
    )
    await nextFrame()

    // Still the last value written while attached — not the post-leave one.
    expect(box.style.getPropertyValue('--mx')).toBe('40px')

    outside.remove()
  })

  it('writes nothing when the pointer cannot hover', async () => {
    stubMedia({ hover: false, reduce: false })

    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 160, clientY: 110 }),
    )
    await nextFrame()

    expect(box.style.getPropertyValue('--mx')).toBe('')
  })

  it('clears the position under reduced motion so the glow stays static', async () => {
    // Simulate a position written before the preference flipped…
    box.style.setProperty('--mx', '40px')
    box.style.setProperty('--my', '30px')

    stubMedia({ hover: true, reduce: true })

    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 250, clientY: 180 }),
    )
    await nextFrame()

    // …and refuses to produce a new one: the CSS default (50% 50%) renders.
    expect(box.style.getPropertyValue('--mx')).toBe('')
    expect(box.style.getPropertyValue('--my')).toBe('')
  })

  it('stops writing after cleanup', async () => {
    box.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }))
    uninstall()

    box.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 160, clientY: 110 }),
    )
    await nextFrame()

    expect(box.style.getPropertyValue('--mx')).toBe('')
  })
})
