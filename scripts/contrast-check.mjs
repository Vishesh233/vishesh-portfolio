/**
 * Contrast verification (run with: node scripts/contrast-check.mjs)
 *
 * Verifies every foreground/background pair the design system actually pairs,
 * in both themes, against WCAG 2.1 AA. Kept in the repo because a palette
 * tweak that silently breaks AA is exactly the kind of regression a token
 * file gives no warning about.
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
 * large text (>=24px, or >=18.66px bold) and for UI component boundaries.
 */
const PAIRS = [
  // [label, foreground, background, minimum, themes]
  ['body text on background', '#1B1A17', '#FFF8F0', 4.5, 'light'],
  ['body text on surface', '#1B1A17', '#FFFFFF', 4.5, 'light'],
  ['muted text on background', '#5B574F', '#FFF8F0', 4.5, 'light'],
  ['muted text on surface', '#5B574F', '#FFFFFF', 4.5, 'light'],
  ['subtle text on background', '#6F685E', '#FFF8F0', 4.5, 'light'],
  ['subtle text on surface', '#6F685E', '#FFFFFF', 4.5, 'light'],
  ['coral button label on coral fill', '#1B1A17', '#F26B3A', 4.5, 'light'],
  ['coral button label on hover fill', '#1B1A17', '#FF7A4A', 4.5, 'light'],
  ['coral button label on active fill', '#1B1A17', '#E85F2C', 4.5, 'light'],
  ['accent link text on background', '#B24316', '#FFF8F0', 4.5, 'light'],
  ['accent link text on surface', '#B24316', '#FFFFFF', 4.5, 'light'],
  ['teal text on background', '#09646D', '#FFF8F0', 4.5, 'light'],
  ['sun text on background', '#7D4D04', '#FFF8F0', 4.5, 'light'],
  ['border on background', '#E8DFD2', '#FFF8F0', 1.0, 'light'],
  ['control border on background', '#94826A', '#FFF8F0', 3.0, 'light'],
  ['control border on surface', '#94826A', '#FFFFFF', 3.0, 'light'],
  ['focus ring on background', '#B24316', '#FFF8F0', 3.0, 'light'],
  ['focus ring on surface', '#B24316', '#FFFFFF', 3.0, 'light'],

  ['body text on background', '#F6EFE4', '#15130F', 4.5, 'dark'],
  ['body text on surface', '#F6EFE4', '#1F1C17', 4.5, 'dark'],
  ['muted text on background', '#B8AE9F', '#15130F', 4.5, 'dark'],
  ['muted text on surface', '#B8AE9F', '#1F1C17', 4.5, 'dark'],
  ['subtle text on background', '#9C9384', '#15130F', 4.5, 'dark'],
  ['subtle text on surface', '#9C9384', '#1F1C17', 4.5, 'dark'],
  ['coral button label on coral fill', '#15130F', '#FF8F5E', 4.5, 'dark'],
  ['coral button label on hover fill', '#15130F', '#FFA57C', 4.5, 'dark'],
  ['accent link text on background', '#FF9466', '#15130F', 4.5, 'dark'],
  ['accent link text on surface', '#FF9466', '#1F1C17', 4.5, 'dark'],
  ['teal text on background', '#33B6C2', '#15130F', 4.5, 'dark'],
  ['sun text on background', '#FFC65C', '#15130F', 4.5, 'dark'],
  ['border on background', '#332E26', '#15130F', 1.0, 'dark'],
  ['control border on background', '#7A6E5C', '#15130F', 3.0, 'dark'],
  ['control border on surface', '#7A6E5C', '#1F1C17', 3.0, 'dark'],
  ['focus ring on background', '#FF9466', '#15130F', 3.0, 'dark'],
  ['focus ring on surface', '#FF9466', '#1F1C17', 3.0, 'dark'],
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