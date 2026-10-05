/**
 * Project image resolution.
 *
 * Turns the filenames recorded in `images.json` (written by
 * scripts/optimize-images.mjs) into resolved, content-hashed URLs, and pairs
 * each one with a ready-made `srcset`.
 *
 * WHY `import.meta.glob` RATHER THAN DYNAMIC `import()`
 * The manifest names its files at runtime, so a plain `import(path)` would be a
 * variable path — Vite cannot statically analyse that and would leave it alone,
 * breaking in production. `import.meta.glob` with `?url` is resolved at build
 * time, so every filename becomes a real hashed asset URL that Vite knows
 * about and fingerprints. The build fails loudly if a file is renamed, instead
 * of 404-ing at runtime.
 *
 * NOTE ON BUNDLE SIZE
 * The glob is `eager`, so every matched file becomes a tiny JS module exporting
 * a URL string. That does NOT download the images — an `<img>` only fetches the
 * URL when the browser actually renders it, which `loading="lazy"` further
 * defers until the image is near the viewport.
 */

import manifest from '../assets/projects/images.json'

/** Resolved URLs keyed by bare filename, e.g. `libverse-480.webp`. */
function indexByFilename(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, url]) => [path.split('/').pop(), url]),
  )
}

const webpUrls = indexByFilename(
  import.meta.glob('../assets/projects/*.webp', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

const pngUrls = indexByFilename(
  import.meta.glob('../assets/projects/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

/**
 * Per-project image data, ready to drop into a `<picture>`.
 *
 * · `srcSet`  — WebP ladder, narrowest first, each candidate width-suffixed.
 * · `src`     — the original PNG, for any browser without WebP support.
 * · `width` / `height` — intrinsic dimensions from the manifest, so the
 *   browser reserves the correct box before the bytes arrive and the page
 *   never shifts.
 *
 * Sorted ascending by width: browsers parse `srcset` independently of order,
 * but ascending order keeps the value readable in devtools and matches the
 * convention.
 */
export const projectImages = Object.fromEntries(
  Object.entries(manifest).map(([name, entry]) => {
    const variants = [...entry.variants].sort((a, b) => a.width - b.width)

    return [
      name,
      {
        width: entry.width,
        height: entry.height,
        src: pngUrls[entry.png],
        srcSet: variants
          .map((variant) => `${webpUrls[variant.file]} ${variant.width}w`)
          .join(', '),
      },
    ]
  }),
)

/**
 * Lookup for a project id.
 *
 * Returns `null` for an unknown id so a caller can render a deliberate
 * fallback rather than crashing the whole section on one bad data entry.
 */
export function getProjectImage(name) {
  return projectImages[name] ?? null
}