/**
 * Contrast verification (run with: node scripts/contrast-check.mjs)
 *
 * Verifies every foreground/background pair the design system actually pairs,
 * in both themes (Twilight Mist dark, Moonstone light), against WCAG 2.1 AA —
 * including hover, active and focus states, the hover-pop hairline, the gold
 * stat-hover figure, every hero gradient-name stop (over the plain canvas AND
 * worst-case hero wash blends), and text over the worst-case cursor-light
 * blend on cards. Kept in the repo because a palette tweak that silently
 * breaks AA is exactly the kind of regression a token file gives no warning
 * about.
 *
 * No dependencies: the maths is a few lines and pulling in a colour library to
 * compute luminance would be more code than the check itself.
 */

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value
  return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16))
}

/** Relative luminance per WCAG 2.1. */
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const srgb = channel / 255
    return srgb <= 0.03928
      ? srgb / 12.92
      : ((srgb + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

/**
 * sRGB alpha blend, as the browser composites the cursor light over a
 * surface: `tint` painted over `base` at `alpha`, rounded to 8-bit. Keeping
 * the maths here (rather than typing the resulting hexes into PAIRS) means
 * the checks track the values in utilities.css — change the glow, change the
 * alpha beside it, and the worst case follows.
 */
const blend = (base, tint, alpha) => {
  const from = hexToRgb(base)
  const to = hexToRgb(tint)
  return (
    '#' +
    from
      .map((channel, i) =>
        Math.round(channel + (to[i] - channel) * alpha)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  )
}

/**
 * Worst-case cores of the cursor light — the radial at full strength under
 * the text, exactly as utilities.css paints it (light: accent blue #3F5FE8
 * at 7% over the light surface; dark: Twilight teal #22C7B8 at 14% over the
 * twilight surface). Every colour that renders inside a card is checked over
 * these as well as over the bare surface, because the light is behind the
 * text, never under it.
 */
const glowLightSurface = blend('#FFFFFF', '#3F5FE8', 0.07)
const glowLightBackground = blend('#F4F6FA', '#3F5FE8', 0.07)
const glowDarkSurface = blend('#0D1220', '#22C7B8', 0.14)
const glowDarkBackground = blend('#080B14', '#22C7B8', 0.14)

/**
 * Worst-case hero wash tails. The two hero blobs render at 50%/30% opacity,
 * heavily blurred, with their cores off-canvas — nothing behind the h1 or
 * the intro copy ever exceeds a ~15% effective blend of the wash colour.
 * Light: pastel wash-blue #C9D5F5; dark: electric blue #4F7CFF.
 */
const heroTailLight = blend('#F4F6FA', '#C9D5F5', 0.15)
const heroTailDark = blend('#080B14', '#4F7CFF', 0.15)

/**
 * The identity monogram plate's mid stop — the surface the fallback VK
 * letter sits on. Both themes use a deep twilight glass, so one pair per
 * theme covers it.
 */
const plateLight = '#123B3C'
const plateDark = '#0F2029'

/**
 * Every pair the UI actually renders together.
 * `min` is the WCAG AA threshold for that pair: 4.5 for body text, 3.0 for
 * large text (>=24px, or >=18.66px bold) and for UI component boundaries;
 * 1.0 is the decorative-hairline sanity floor (border is never the only
 * affordance, so it is informational rather than a requirement).
 *
 * Glow-tail hexes are the worst-case 40% blends of the hero wash tokens over
 * each canvas — the blob cores sit off-canvas, so nothing behind text is ever
 * stronger than this.
 */
const PAIRS = [
  // [label, foreground, background, minimum, themes]
  // ------------------------------------------------------------- LIGHT
  // Moonstone text ramp on its three surfaces.
  ['body text on background', '#172033', '#F4F6FA', 4.5, 'light'],
  ['body text on surface', '#172033', '#FFFFFF', 4.5, 'light'],
  ['body text on surface-raised', '#172033', '#E9EDF5', 4.5, 'light'],
  ['muted text on background', '#536078', '#F4F6FA', 4.5, 'light'],
  ['muted text on surface', '#536078', '#FFFFFF', 4.5, 'light'],
  ['muted-strong text on background', '#46516A', '#F4F6FA', 4.5, 'light'],
  ['muted-strong text on surface', '#46516A', '#FFFFFF', 4.5, 'light'],
  ['subtle text on background', '#626D80', '#F4F6FA', 4.5, 'light'],
  ['subtle text on surface', '#626D80', '#FFFFFF', 4.5, 'light'],
  ['accent label on background', '#3A55D8', '#F4F6FA', 4.5, 'light'],
  ['accent label on surface', '#3A55D8', '#FFFFFF', 4.5, 'light'],
  ['accent label on surface-raised', '#3A55D8', '#E9EDF5', 4.5, 'light'],
  ['secondary label on background', '#6B4DB5', '#F4F6FA', 4.5, 'light'],
  ['secondary label on surface', '#6B4DB5', '#FFFFFF', 4.5, 'light'],
  ['gold metadata on background', '#87642F', '#F4F6FA', 4.5, 'light'],
  ['gold metadata on surface', '#87642F', '#FFFFFF', 4.5, 'light'],
  ['gold metadata on surface-raised', '#87642F', '#E9EDF5', 4.5, 'light'],
  ['success status text on surface', '#0E7C51', '#FFFFFF', 4.5, 'light'],
  ['accent-on label on accent fill', '#FFFFFF', '#3F5FE8', 4.5, 'light'],
  ['accent-on label on hover fill', '#FFFFFF', '#3550CE', 4.5, 'light'],
  ['accent-on label on active fill', '#FFFFFF', '#2C45B4', 4.5, 'light'],
  // Hero h1 gradient stops — display type, held to AA on the plain canvas.
  ['gradient name (from) on background', '#3A55D8', '#F4F6FA', 4.5, 'light'],
  ['gradient name (mid) on background', '#0E7C71', '#F4F6FA', 4.5, 'light'],
  ['gradient name (to) on background', '#6B4DB5', '#F4F6FA', 4.5, 'light'],
  // Over the hero wash tail these remain large text, so the 3:1 floor is
  // the WCAG-correct threshold; all three would clear 4.4 on the plain
  // canvas alone.
  ['gradient name (from) over hero wash tail', '#3A55D8', heroTailLight, 3.0, 'light'],
  ['gradient name (mid) over hero wash tail', '#0E7C71', heroTailLight, 3.0, 'light'],
  ['gradient name (to) over hero wash tail', '#6B4DB5', heroTailLight, 3.0, 'light'],
  // Hero body copy over the same tail.
  ['body text over hero wash tail', '#172033', heroTailLight, 4.5, 'light'],
  ['muted text over hero wash tail', '#536078', heroTailLight, 4.5, 'light'],
  // Non-text UI: focus ring, control outlines, hover hairline (3:1).
  ['focus ring on background', '#3A55D8', '#F4F6FA', 3.0, 'light'],
  ['focus ring on surface', '#3A55D8', '#FFFFFF', 3.0, 'light'],
  ['control border on background', '#6B7F97', '#F4F6FA', 3.0, 'light'],
  ['control border on surface', '#6B7F97', '#FFFFFF', 3.0, 'light'],
  ['control border on surface-raised', '#6B7F97', '#E9EDF5', 3.0, 'light'],
  ['hover-pop hairline on background', '#3A55D8', '#F4F6FA', 3.0, 'light'],
  ['hover-pop hairline on surface', '#3A55D8', '#FFFFFF', 3.0, 'light'],
  ['hover-pop hairline on surface-raised', '#3A55D8', '#E9EDF5', 3.0, 'light'],
  ['accent dot on surface', '#3F5FE8', '#FFFFFF', 3.0, 'light'],
  ['secondary dot on surface', '#9B7CFF', '#FFFFFF', 3.0, 'light'],
  ['tertiary dot on surface', '#1E9E92', '#FFFFFF', 3.0, 'light'],
  ['hairline border on background', '#DDE4F0', '#F4F6FA', 1.0, 'light'],
  ['hairline border on surface', '#DDE4F0', '#FFFFFF', 1.0, 'light'],
  ['plate letter on plate surface', '#F4F6FA', plateLight, 4.5, 'light'],

  // ------------------------------------------------------------- DARK
  // Twilight Mist text ramp on its three surfaces.
  ['body text on background', '#F3F4F6', '#080B14', 4.5, 'dark'],
  ['body text on surface', '#F3F4F6', '#0D1220', 4.5, 'dark'],
  ['body text on surface-raised', '#F3F4F6', '#111827', 4.5, 'dark'],
  ['muted text on background', '#A8B1C2', '#080B14', 4.5, 'dark'],
  ['muted text on surface', '#A8B1C2', '#0D1220', 4.5, 'dark'],
  ['muted text on surface-raised', '#A8B1C2', '#111827', 4.5, 'dark'],
  ['muted-strong text on surface', '#C3CADF', '#0D1220', 4.5, 'dark'],
  ['muted-strong text on background', '#C3CADF', '#080B14', 4.5, 'dark'],
  ['subtle text on background', '#8B94A8', '#080B14', 4.5, 'dark'],
  ['subtle text on surface', '#8B94A8', '#0D1220', 4.5, 'dark'],
  ['subtle text on surface-raised', '#8B94A8', '#111827', 4.5, 'dark'],
  ['accent label on background', '#22C7B8', '#080B14', 4.5, 'dark'],
  ['accent label on surface', '#22C7B8', '#0D1220', 4.5, 'dark'],
  ['accent label on surface-raised', '#22C7B8', '#111827', 4.5, 'dark'],
  ['secondary label on background', '#A78BFA', '#080B14', 4.5, 'dark'],
  ['secondary label on surface', '#A78BFA', '#0D1220', 4.5, 'dark'],
  ['gold metadata on background', '#C6A15B', '#080B14', 4.5, 'dark'],
  ['gold metadata on surface', '#C6A15B', '#0D1220', 4.5, 'dark'],
  ['gold metadata on surface-raised', '#C6A15B', '#111827', 4.5, 'dark'],
  ['success status text on surface', '#4ADE80', '#0D1220', 4.5, 'dark'],
  ['accent-on label on accent fill', '#080B14', '#22C7B8', 4.5, 'dark'],
  ['accent-on label on hover fill', '#080B14', '#2BD8C9', 4.5, 'dark'],
  ['accent-on label on active fill', '#080B14', '#1FC2B5', 4.5, 'dark'],
  // Hero h1 gradient stops (display type, held to AA on the plain canvas).
  ['gradient name (from) on background', '#22C7B8', '#080B14', 4.5, 'dark'],
  ['gradient name (mid) on background', '#8B6DFF', '#080B14', 4.5, 'dark'],
  ['gradient name (to) on background', '#4F7CFF', '#080B14', 4.5, 'dark'],
  ['gradient name (from) over hero wash tail', '#22C7B8', heroTailDark, 4.5, 'dark'],
  ['gradient name (mid) over hero wash tail', '#8B6DFF', heroTailDark, 4.5, 'dark'],
  ['gradient name (to) over hero wash tail', '#4F7CFF', heroTailDark, 4.5, 'dark'],
  ['body text over hero wash tail', '#F3F4F6', heroTailDark, 4.5, 'dark'],
  ['muted text over hero wash tail', '#A8B1C2', heroTailDark, 4.5, 'dark'],
  // Non-text UI: focus ring, control outlines, hover hairline (3:1).
  ['focus ring on background', '#22C7B8', '#080B14', 3.0, 'dark'],
  ['focus ring on surface', '#22C7B8', '#0D1220', 3.0, 'dark'],
  ['focus ring on surface-raised', '#22C7B8', '#111827', 3.0, 'dark'],
  ['control border on background', '#5A6B8B', '#080B14', 3.0, 'dark'],
  ['control border on surface', '#5A6B8B', '#0D1220', 3.0, 'dark'],
  ['control border on surface-raised', '#5A6B8B', '#111827', 3.0, 'dark'],
  ['hover-pop hairline on background', '#8B6DFF', '#080B14', 3.0, 'dark'],
  ['hover-pop hairline on surface', '#8B6DFF', '#0D1220', 3.0, 'dark'],
  ['hover-pop hairline on surface-raised', '#8B6DFF', '#111827', 3.0, 'dark'],
  ['accent dot on surface', '#22C7B8', '#0D1220', 3.0, 'dark'],
  ['secondary dot on surface', '#8B6DFF', '#0D1220', 3.0, 'dark'],
  ['tertiary dot on surface', '#4F7CFF', '#0D1220', 3.0, 'dark'],
  ['hairline border on background', '#263550', '#080B14', 1.0, 'dark'],
  ['hairline border on surface', '#263550', '#0D1220', 1.0, 'dark'],
  ['plate letter on plate surface', '#F3F4F6', plateDark, 4.5, 'dark'],

  // ------------------------------------------- CURSOR LIGHT (worst-case core)
  // Text over the surface at the moment the glow is at full strength behind
  // it — hover and :focus-visible show the light and the text together, so
  // this is the pairing a visitor actually reads.
  ['body text over cursor glow (surface)', '#172033', glowLightSurface, 4.5, 'light'],
  ['muted text over cursor glow (surface)', '#536078', glowLightSurface, 4.5, 'light'],
  ['muted-strong text over cursor glow (surface)', '#46516A', glowLightSurface, 4.5, 'light'],
  ['subtle text over cursor glow (surface)', '#626D80', glowLightSurface, 4.5, 'light'],
  ['accent label over cursor glow (surface)', '#3A55D8', glowLightSurface, 4.5, 'light'],
  ['gold metadata over cursor glow (surface)', '#87642F', glowLightSurface, 4.5, 'light'],
  ['muted-strong text over cursor glow (background)', '#46516A', glowLightBackground, 4.5, 'light'],
  ['accent label over cursor glow (background)', '#3A55D8', glowLightBackground, 4.5, 'light'],
  ['body text over cursor glow (surface)', '#F3F4F6', glowDarkSurface, 4.5, 'dark'],
  ['muted text over cursor glow (surface)', '#A8B1C2', glowDarkSurface, 4.5, 'dark'],
  ['muted-strong text over cursor glow (surface)', '#C3CADF', glowDarkSurface, 4.5, 'dark'],
  ['subtle text over cursor glow (surface)', '#8B94A8', glowDarkSurface, 4.5, 'dark'],
  ['accent label over cursor glow (surface)', '#22C7B8', glowDarkSurface, 4.5, 'dark'],
  ['gold metadata over cursor glow (surface)', '#C6A15B', glowDarkSurface, 4.5, 'dark'],
  ['muted-strong text over cursor glow (background)', '#C3CADF', glowDarkBackground, 4.5, 'dark'],
  ['accent label over cursor glow (background)', '#22C7B8', glowDarkBackground, 4.5, 'dark'],

  // ------------------------------------------------ STAT NUMBER, HOVER STATE
  // ~40px display type, checked at full 4.5 anyway — over the bare card
  // surface and over the glow, which appears in the same hover. The hover
  // colour is the brief's gold in both themes.
  ['stat number on surface', '#101A2B', '#FFFFFF', 4.5, 'light'],
  ['stat number on surface', '#F9FAFC', '#0D1220', 4.5, 'dark'],
  ['stat number (hover) on surface', '#87642F', '#FFFFFF', 4.5, 'light'],
  ['stat number (hover) on surface', '#C6A15B', '#0D1220', 4.5, 'dark'],
  ['stat number (hover) over cursor glow', '#87642F', glowLightSurface, 4.5, 'light'],
  ['stat number (hover) over cursor glow', '#C6A15B', glowDarkSurface, 4.5, 'dark'],
]

let failures = 0

console.log('WCAG 2.1 AA contrast check\n')

for (const [label, fg, bg, min, theme] of PAIRS) {
  const value = ratio(fg, bg)
  const passes = value >= min
  if (!passes) failures += 1

  console.log(
    `${passes ? 'PASS' : 'FAIL'}  ${theme.padEnd(5)}  ` +
      `${value.toFixed(2).padStart(6)}:1  (min ${min.toFixed(1)})  ${label}`,
  )
}

console.log(
  `\n${PAIRS.length - failures}/${PAIRS.length} pairs pass.` +
    (failures === 0 ? ' All themes meet AA.' : ` ${failures} FAILING.`),
)

process.exit(failures === 0 ? 0 : 1)