/**
 * Image optimisation.
 *
 *   node scripts/optimize-images.mjs
 *
 * Generates a WebP variant and a set of responsive widths for every project
 * screenshot, alongside the original PNG. PNG stays as the `<picture>` fallback
 * so the page still renders on any browser.
 *
 * WHY RESPONSIVE WIDTHS AND NOT JUST ONE WEBP
 * A card is roughly 400px wide on a phone and the modal is up to ~900px. A
 * single 1919px image would make a phone download 5x more pixels than it can
 * display. Emitting a small ladder and letting `srcset` choose means each
 * viewport fetches the smallest file that still looks sharp on it.
 *
 * WHY WEBP AND NOT AVIF
 * WebP is supported everywhere that matters and encodes these screenshots to a
 * fraction of their PNG size. AVIF would be smaller again but is still worth a
 * second pass later, behind its own `<source type>` — not worth the extra build
 * complexity now.
 *
 * NOT UPSTREAMED. The PNGs stay in the repo as the fallback, so this script only
 * ever adds files. It is safe to re-run at any time; it overwrites its own
 * output and rewrites the manifest.
 *
 * OUTPUT
 *   src/assets/projects/<name>.webp          full-width WebP
 *   src/assets/projects/<name>-<w>.webp      responsive ladder
 *   src/assets/projects/images.json          manifest consumed by site.js
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const ASSET_DIR = join(ROOT, 'src', 'assets', 'projects')
const MANIFEST = join(ASSET_DIR, 'images.json')

/** Candidate widths. Anything wider than the source is skipped. */
const WIDTHS = [480, 768, 1024, 1440]

/** WebP quality. 80 is visually lossless on UI screenshots and ~5x smaller. */
const QUALITY = 80

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`

/** Every PNG in the asset folder, excluding anything we generated. */
async function sourceImages() {
  const entries = await readdir(ASSET_DIR)

  return entries
    .filter((name) => extname(name).toLowerCase() === '.png')
    .filter((name) => !/-\d+\.png$/.test(name))
    .sort()
}

async function run() {
  const images = await sourceImages()

  if (images.length === 0) {
    console.log('No PNG sources found in src/assets/projects/. Nothing to do.')
    return
  }

  const manifest = {}
  const report = []

  for (const file of images) {
    const name = basename(file, '.png')
    const source = join(ASSET_DIR, file)

    const image = sharp(source)
    const meta = await image.metadata()

    const originalBytes = (await stat(source)).size

    // Only widths that do not upscale.
    const widths = WIDTHS.filter((width) => width < meta.width)

    const variants = []

    // Full-width WebP keeps the modal sharp on wide screens.
    const fullTarget = join(ASSET_DIR, `${name}.webp`)
    await sharp(source)
      .webp({ quality: QUALITY })
      .toFile(fullTarget)

    const fullBytes = (await stat(fullTarget)).size
    variants.push({ width: meta.width, file: `${name}.webp`, bytes: fullBytes })

    for (const width of widths) {
      const target = join(ASSET_DIR, `${name}-${width}.webp`)
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(target)

      const bytes = (await stat(target)).size
      variants.push({ width, file: `${name}-${width}.webp`, bytes })
    }

    manifest[name] = {
      width: meta.width,
      height: meta.height,
      png: file,
      webp: `${name}.webp`,
      variants,
    }

    const smallest = variants.reduce((min, v) =>
      v.bytes < min.bytes ? v : min,
    )

    report.push({
      name,
      dimensions: `${meta.width}x${meta.height}`,
      originalBytes,
      fullBytes,
      smallestBytes: smallest.bytes,
      smallestWidth: smallest.width,
      variantCount: variants.length,
    })
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  // Readable before/after summary.
  const pad = (value, width) => String(value).padEnd(width)

  console.log('\nImage optimisation report')
  console.log('='.repeat(78))
  console.log(
    pad('image', 20) + pad('source', 14) + pad('PNG', 11) + pad('WebP (full)', 14) + pad('smallest', 16),
  )
  console.log('-'.repeat(78))

  let originalTotal = 0
  let smallestTotal = 0

  for (const row of report) {
    originalTotal += row.originalBytes
    smallestTotal += row.smallestBytes

    console.log(
      pad(row.name, 20) +
        pad(row.dimensions, 14) +
        pad(kb(row.originalBytes), 11) +
        pad(kb(row.fullBytes), 14) +
        pad(`${kb(row.smallestBytes)} @${row.smallestWidth}px`, 16),
    )
  }

  console.log('-'.repeat(78))
  console.log(
    `Totals: ${kb(originalTotal)} of PNG -> ${kb(smallestTotal)} at the smallest variant ` +
      `(${((1 - smallestTotal / originalTotal) * 100).toFixed(0)}% smaller).`,
  )
  console.log(`Manifest written to src/assets/projects/images.json\n`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})