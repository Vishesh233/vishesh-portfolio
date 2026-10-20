import { getProjectImage } from '../../lib/images.js'

/**
 * A project screenshot, served as WebP with a PNG fallback.
 *
 * SHARED BY THE CARD AND THE MODAL
 * Both render the same file at very different sizes, so the `sizes` attribute
 * is the only thing that differs between them — everything else (format
 * negotiation, intrinsic dimensions, alt text, lazy loading) is identical and
 * lives here, so the two can never drift apart.
 *
 * FORMAT NEGOTIATION
 * `<picture>` lets the browser pick: every current browser takes the WebP
 * `<source>`, and anything without WebP support falls through to the `<img>`'s
 * PNG `src`. The `srcset` on the `<source>` is a width-descriptor ladder, so a
 * phone fetches the 480px file rather than the 1919px original.
 *
 * WHY width/height MATTER
 * Both attributes are set from the manifest, which read them off the files on
 * disk. The browser therefore reserves the correct aspect-ratio box before any
 * image bytes arrive, so the page does not jump when they do. `height:auto` in
 * the class list then lets the image scale to that reserved box.
 *
 * LAZY BY DEFAULT
 * Card images are below the fold, so `loading="lazy"` defers them until they are
 * close to the viewport. The modal's image is only rendered once the modal is
 * open, which is by definition after the user has interacted, so it stays lazy
 * too — there is no reason to force a fetch.
 */
export function ProjectImage({
  name,
  alt,
  sizes,
  priority = false,
  className = '',
  imgClassName = '',
}) {
  const image = getProjectImage(name)

  // A missing entry renders nothing rather than an <img> pointing at undefined,
  // which would produce a broken image icon and a console error.
  if (!image) return null

  return (
    <picture>
      {/* Lowercase `srcset` rather than React's `srcSet`: React serialises the
          prop with its camel-case name on <source>, and although HTML attribute
          names are case-insensitive so browsers still honour it, emitting the
          canonical lowercase form avoids tripping strict HTML validators and
          linters. */}
      <source type="image/webp" srcset={image.srcSet} sizes={sizes} />
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={[className, imgClassName].filter(Boolean).join(' ')}
      />
    </picture>
  )
}