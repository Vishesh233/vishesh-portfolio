/**
 * Pure geometry and colour maths for the hero lattice.
 *
 * Kept free of React and of any canvas API so the maths can be reasoned about
 * (and unit-tested) independently of the render loop. The React shell that
 * drives this lives in src/components/three/HeroLattice.jsx.
 *
 * WHY A HAND-ROLLED RENDERER
 * The hero needs perspective projection, depth fog and pointer-driven tilt.
 * Three.js plus React Three Fiber would add roughly a quarter of a megabyte of
 * JavaScript to draw a single quiet wireframe object. Canvas 2D expresses all
 * three directly, costs nothing to download, and keeps the render loop under
 * our control — which is what makes pausing it when off-screen possible.
 */

/** Reads a colour token off :root and returns its [r, g, b] channels. */
export function readTokenColor(cssVariable, fallback) {
  if (typeof window === 'undefined') return fallback

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariable)
    .trim()

  if (!raw) return fallback

  const rgb = raw.match(/^rgba?\(([^)]+)\)$/i)
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean)
    const [r, g, b] = parts.map(Number)
    if ([r, g, b].every(Number.isFinite)) return [r, g, b]
    return fallback
  }

  const hex = raw.match(/^#?([\da-f]{3}|[\da-f]{6})$/i)
  if (hex) {
    let value = hex[1]
    if (value.length === 3) {
      value = value
        .split('')
        .map((char) => char + char)
        .join('')
    }
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16),
    ]
  }

  return fallback
}

/** Builds an `rgba()` string from channel values and an alpha. */
export function rgba([r, g, b], alpha) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * A displaced plane sampled as a point grid.
 *
 * Returns a flat Float32Array of xyz triples plus the index pairs describing
 * which points to connect. A plane — rather than a sphere or cube — keeps the
 * silhouette quiet and lets the wave read as a structure rather than an object.
 */
export function createLattice({ resolution = 16, extent = 2.4 } = {}) {
  const stride = resolution + 1
  const points = new Float32Array(stride * stride * 3)

  let cursor = 0
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      points[cursor++] = (i / resolution - 0.5) * extent * 2
      points[cursor++] = 0
      points[cursor++] = (j / resolution - 0.5) * extent * 2
    }
  }

  const segments = []
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const current = i * stride + j
      if (i < resolution) segments.push(current, current + stride)
      if (j < resolution) segments.push(current, current + 1)
    }
  }

  return { points, segments }
}

/**
 * Height of the surface at a point and time.
 *
 * Two interfering sine fields: a broad one that gives the plane its overall
 * swell, and a finer diagonal one that keeps the crests from looking
 * mechanical. Kept low-frequency so the motion reads as a slow drift.
 */
export function waveHeight(x, z, t) {
  return (
    Math.sin(x * 1.45 + t * 0.55) * Math.cos(z * 1.45 - t * 0.35) * 0.3 +
    Math.sin((x + z) * 0.85 - t * 0.8) * 0.11
  )
}

/**
 * Rotates a point about Y then X and projects it to screen space.
 *
 * `view.focal` is the focal length expressed as a fraction of the canvas
 * height, so the projection is resolution-independent: at focal 0.62 and a
 * height of 800 the focal length is ~496px. Dividing that by the view-space
 * depth gives the pixels-per-world-unit factor for this point.
 *
 * Returns `null` for points behind the camera so they can be discarded rather
 * than wrapping around and producing artefacts.
 */
export function projectPoint(x, y, z, view, width, height) {
  const cosY = Math.cos(view.yaw)
  const sinY = Math.sin(view.yaw)
  const rotatedX = x * cosY - z * sinY
  const rotatedZ = x * sinY + z * cosY

  const cosX = Math.cos(view.pitch)
  const sinX = Math.sin(view.pitch)
  const rotatedY = y * cosX - rotatedZ * sinX
  const depthZ = y * sinX + rotatedZ * cosX

  const depth = view.distance - depthZ
  if (depth <= 0.05) return null

  const scale = (view.focal * height) / depth
  return {
    x: width / 2 + rotatedX * scale,
    y: height * 0.55 - rotatedY * scale,
    scale,
    depth,
  }
}

/** Linear interpolation, used for damping pointer input toward its target. */
export function damp(current, target, smoothing) {
  return current + (target - current) * smoothing
}