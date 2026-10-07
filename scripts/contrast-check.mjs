/**
 * Contrast verification (run with: node scripts/contrast-check.mjs)
 *
 * Verifies every foreground/background pair the design system actually pairs,
 * in both themes (Navy & Sky), against WCAG 2.1 AA — including hover, active
 * and focus states, the hover-pop hairline and both hero gradient-name stops
 * (over the plain canvas AND over the worst-case hero glow blend). Kept in the
 * repo because a palette tweak that silently breaks AA is exactly the kind of
 * regression a token file gives no warning about.
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
  ['body text on background', '#0F1B2D', '#F4F9FF', 4.5, 'light'],
  ['body text on surface', '#0F1B2D', '#FFFFFF', 4.5, 'light'],
  ['body text on surface-raised', '#0F1B2D', '#EDF5FF', 4.5, 'light'],
  ['muted text on background', '#4A5A70', '#F4F9FF', 4.5, 'light'],
  ['muted text on surface', '#4A5A70', '#FFFFFF', 4.5, 'light'],
  ['muted-strong text on surface', '#33455E', '#FFFFFF', 4.5, 'light'],
  ['muted-strong text on background', '#33455E', '#F4F9FF', 4.5, 'light'],
  ['subtle text on background', '#5C6E86', '#F4F9FF', 4.5, 'light'],
  ['subtle text on surface', '#5C6E86', '#FFFFFF', 4.5, 'light'],
  ['subtle text on surface-raised', '#5C6E86', '#EDF5FF', 4.5, 'light'],
  ['accent link/label text on background', '#0369A1', '#F4F9FF', 4.5, 'light'],
  ['accent link/label text on surface', '#0369A1', '#FFFFFF', 4.5, 'light'],
  ['accent link/label text on surface-raised', '#0369A1', '#EDF5FF', 4.5, 'light'],
  ['secondary text on background', '#1D4ED8', '#F4F9FF', 4.5, 'light'],
  ['secondary text on surface', '#1D4ED8', '#FFFFFF', 4.5, 'light'],
  ['success status text on surface', '#0E7490', '#FFFFFF', 4.5, 'light'],
  ['accent-on label on accent fill', '#04202A', '#06B6D4', 4.5, 'light'],
  ['accent-on label on hover fill', '#04202A', '#22D3EE', 4.5, 'light'],
  ['accent-on label on active fill', '#04202A', '#67E8F9', 4.5, 'light'],
  ['gradient name stop on background', '#0369A1', '#F4F9FF', 4.5, 'light'],
  ['gradient name stop on surface', '#0369A1', '#FFFFFF', 4.5, 'light'],
  ['gradient name over hero glow tail', '#0369A1', '#CDE4FE', 4.5, 'light'],
  ['focus ring on background', '#0369A1', '#F4F9FF', 3.0, 'light'],
  ['focus ring on surface', '#0369A1', '#FFFFFF', 3.0, 'light'],
  ['control border on background', '#748CAB', '#F4F9FF', 3.0, 'light'],
  ['control border on surface', '#748CAB', '#FFFFFF', 3.0, 'light'],
  ['control border on surface-raised', '#748CAB', '#EDF5FF', 3.0, 'light'],
  ['hover-pop hairline on background', '#0891B2', '#F4F9FF', 3.0, 'light'],
  ['hover-pop hairline on surface', '#0891B2', '#FFFFFF', 3.0, 'light'],
  ['hover-pop hairline on surface-raised', '#0891B2', '#EDF5FF', 3.0, 'light'],
  ['category dot on surface', '#2563EB', '#FFFFFF', 3.0, 'light'],
  ['category dot on background', '#2563EB', '#F4F9FF', 3.0, 'light'],
  ['hairline border on background', '#D6E6F5', '#F4F9FF', 1.0, 'light'],
  ['hairline border on surface', '#D6E6F5', '#FFFFFF', 1.0, 'light'],

  // ------------------------------------------------------------- DARK
  ['body text on background', '#F1F7FF', '#050B1A', 4.5, 'dark'],
  ['body text on surface', '#F1F7FF', '#0B1426', 4.5, 'dark'],
  ['body text on surface-raised', '#F1F7FF', '#101B32', 4.5, 'dark'],
  ['muted text on background', '#9FB3CE', '#050B1A', 4.5, 'dark'],
  ['muted text on surface', '#9FB3CE', '#0B1426', 4.5, 'dark'],
  ['muted text on surface-raised', '#9FB3CE', '#101B32', 4.5, 'dark'],
  ['muted-strong text on surface', '#C3D2E8', '#0B1426', 4.5, 'dark'],
  ['muted-strong text on background', '#C3D2E8', '#050B1A', 4.5, 'dark'],
  ['subtle text on background', '#8399B8', '#050B1A', 4.5, 'dark'],
  ['subtle text on surface', '#8399B8', '#0B1426', 4.5, 'dark'],
  ['subtle text on surface-raised', '#8399B8', '#101B32', 4.5, 'dark'],
  ['accent link/label text on background', '#22D3EE', '#050B1A', 4.5, 'dark'],
  ['accent link/label text on surface', '#22D3EE', '#0B1426', 4.5, 'dark'],
  ['accent link/label text on surface-raised', '#22D3EE', '#101B32', 4.5, 'dark'],
  ['secondary text on background', '#60A5FA', '#050B1A', 4.5, 'dark'],
  ['secondary text on surface', '#60A5FA', '#0B1426', 4.5, 'dark'],
  ['success status text on surface', '#67E8F9', '#0B1426', 4.5, 'dark'],
  ['accent-on label on accent fill', '#050B1A', '#22D3EE', 4.5, 'dark'],
  ['accent-on label on hover fill', '#050B1A', '#67E8F9', 4.5, 'dark'],
  ['accent-on label on active fill', '#050B1A', '#A5F3FC', 4.5, 'dark'],
  ['gradient name stop (from) on background', '#60A5FA', '#050B1A', 4.5, 'dark'],
  ['gradient name stop (to) on background', '#22D3EE', '#050B1A', 4.5, 'dark'],
  ['gradient name (from) over hero glow tail', '#60A5FA', '#0F2666', 4.5, 'dark'],
  ['gradient name (to) over hero glow tail', '#22D3EE', '#0F2666', 4.5, 'dark'],
  ['gradient name (to) over cyan glow tail', '#22D3EE', '#064157', 4.5, 'dark'],
  ['focus ring on background', '#22D3EE', '#050B1A', 3.0, 'dark'],
  ['focus ring on surface', '#22D3EE', '#0B1426', 3.0, 'dark'],
  ['focus ring on surface-raised', '#22D3EE', '#101B32', 3.0, 'dark'],
  ['control border on background', '#4F6A9B', '#050B1A', 3.0, 'dark'],
  ['control border on surface', '#4F6A9B', '#0B1426', 3.0, 'dark'],
  ['control border on surface-raised', '#4F6A9B', '#101B32', 3.0, 'dark'],
  ['hover-pop hairline on background', '#22D3EE', '#050B1A', 3.0, 'dark'],
  ['hover-pop hairline on surface', '#22D3EE', '#0B1426', 3.0, 'dark'],
  ['hover-pop hairline on surface-raised', '#22D3EE', '#101B32', 3.0, 'dark'],
  ['category dot on surface', '#3B82F6', '#0B1426', 3.0, 'dark'],
  ['category dot on background', '#3B82F6', '#050B1A', 3.0, 'dark'],
  ['hairline border on background', '#1B2A47', '#050B1A', 1.0, 'dark'],
  ['hairline border on surface', '#1B2A47', '#0B1426', 1.0, 'dark'],
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