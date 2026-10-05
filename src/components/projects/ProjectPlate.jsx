import { useMemo } from 'react'

/**
 * Deterministic pseudo-random source.
 *
 * The plate compositions must be stable across renders — a decorative field
 * that reshuffles on every re-render reads as a glitch, and would differ
 * between server and client. A seeded FNV-1a hash gives a stable sequence from
 * the project id with no global state.
 */
function createRandom(seed) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return function next() {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    hash ^= hash >>> 16
    return (hash >>> 0) / 4294967296
  }
}

const LINE = 'var(--color-bone-200)'
const EMBER = 'var(--color-ember-400)'

/**
 * Coordinate space every composition is drawn in.
 *
 * Wide and landscape, because the stages these sit in are landscape. A square
 * plate inside a wide frame letterboxes — dead bands at both edges that read as
 * a mistake rather than as art direction. These compositions are cropped rather
 * than letterboxed (see `preserveAspectRatio`), so they hold at any proportion.
 */
const CANVAS = { width: 800, height: 500 }

/**
 * CATALOGUE — a dense ruled index of records.
 *
 * Chosen for LibVerse: a role-based library system backed by a database is
 * structurally a catalogue, and a field of ruled entries states that without
 * depicting a product interface that has never been shown.
 *
 * Density falls off toward the right so the field reads as *filled and then
 * trailing away* — the shape of an index rather than uniform noise.
 */
function Catalogue({ random }) {
  const rows = 16
  const rowHeight = CANVAS.height / rows
  const columns = 24
  const cellWidth = CANVAS.width / columns

  const cells = []
  const accents = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const bias = 1 - column / columns
      if (random() > 0.3 + bias * 0.52) continue

      const cell = {
        x: column * cellWidth + 2,
        y: row * rowHeight + 3,
        width: cellWidth - 4,
        height: rowHeight - 6,
        opacity: 0.05 + random() * 0.13,
      }

      // A handful of ember entries, treated as highlights in the index.
      if (random() > 0.94) {
        accents.push({ ...cell, width: cell.width * 1.6, opacity: 0.52 })
      } else {
        cells.push({ ...cell, key: `${row}-${column}` })
      }
    }
  }

  return (
    <>
      {/* Row rules across the whole field; column rules only at index divisions,
          so the grid reads as a table rather than as graph paper. */}
      <g opacity="0.14" stroke={LINE} strokeWidth="1">
        {Array.from({ length: rows + 1 }, (_, row) => (
          <line
            key={`r${row}`}
            x1="0"
            y1={row * rowHeight}
            x2={CANVAS.width}
            y2={row * rowHeight}
          />
        ))}
        {[0, 6, 12, 18, 23].map((column, index) => (
          <line
            key={`c${index}`}
            x1={column * cellWidth}
            y1="0"
            x2={column * cellWidth}
            y2={CANVAS.height}
            opacity={index === 0 ? 1.8 : 1}
          />
        ))}
      </g>

      {cells.map((cell) => (
        <rect key={cell.key} fill={LINE} {...cell} />
      ))}
      {accents.map((cell, index) => (
        <rect key={`a${index}`} fill={EMBER} {...cell} />
      ))}
    </>
  )
}

/**
 * PIPELINE — services wired into a request/response chain.
 *
 * Chosen for InterviewPilot: a platform built on API integrations is
 * structurally a set of services exchanging data. This states that without
 * implying any particular model, vendor or capability the project may not have.
 *
 * Nodes sit on a loose column grid so the chain reads as travelling across the
 * page, while jitter on each node keeps it from looking like a wiring diagram.
 */
function Pipeline({ random }) {
  const lanes = 8
  const span = (CANVAS.width - 160) / (lanes - 1)

  const nodes = Array.from({ length: 16 }, (_, index) => ({
    x: 80 + (index % lanes) * span + (random() - 0.5) * 44,
    y: 70 + random() * (CANVAS.height - 140),
  }))

  // Wire each node back a varying distance, so the graph has depth rather than
  // being one straight chain.
  const edges = []
  for (let index = 1; index < nodes.length; index += 1) {
    const to = nodes[index - (1 + Math.floor(random() * 3))]
    if (!to) continue

    edges.push({
      key: `e${index}`,
      from: nodes[index],
      to,
      opacity: 0.1 + random() * 0.18,
    })
  }

  return (
    <>
      {/* The axis the exchange runs along. Barely present — a baseline, not a box. */}
      <line
        x1="40"
        y1={CANVAS.height / 2}
        x2={CANVAS.width - 40}
        y2={CANVAS.height / 2}
        stroke={LINE}
        strokeWidth="1"
        opacity="0.07"
      />

      {edges.map((edge) => (
        <line
          key={edge.key}
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke={LINE}
          strokeWidth="1"
          opacity={edge.opacity}
        />
      ))}

      {nodes.map((node, index) => (
        <circle
          key={`n${index}`}
          cx={node.x}
          cy={node.y}
          r={index % 3 === 0 ? 4.5 : 2.5}
          fill={index % 4 === 0 ? EMBER : 'none'}
          stroke={index % 4 === 0 ? EMBER : LINE}
          strokeWidth="1"
          opacity={index % 4 === 0 ? 0.62 : 0.32}
        />
      ))}
    </>
  )
}

/**
 * MODULE FIELD — a scannable grid held inside a viewfinder.
 *
 * Chosen for QR Code Studio, whose verified subject is the generation and
 * scanning of a two-dimensional code.
 *
 * DELIBERATELY NOT A QR SYMBOL. A real symbol is always square and always
 * carries three fixed finder patterns. This field is landscape and carries only
 * open corner brackets, so it cannot be mistaken for — or mistaken into — a
 * working code belonging to the project. It depicts the *idea* of a module grid
 * being scanned, which is the honest abstraction when no screenshot exists.
 */
function ModuleField({ random }) {
  const columns = 21
  const rows = 13
  const cellWidth = CANVAS.width / columns
  const cellHeight = CANVAS.height / rows

  const modules = []
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (random() > 0.46) continue

      const accent = random() > 0.95
      modules.push({
        key: `${row}-${column}`,
        x: column * cellWidth + 2.5,
        y: row * cellHeight + 2.5,
        width: cellWidth - 5,
        height: cellHeight - 5,
        fill: accent ? EMBER : LINE,
        opacity: accent ? 0.46 : 0.06 + random() * 0.16,
      })
    }
  }

  // Open corner brackets — a viewfinder around the field, not a frame around a
  // code. Drawn outside the module grid so they read as the scanner's own optics.
  const arm = 64
  const inset = 14
  const right = CANVAS.width - inset
  const bottom = CANVAS.height - inset

  return (
    <>
      {modules.map((module) => (
        <rect key={module.key} {...module} />
      ))}

      <g fill="none" stroke={EMBER} strokeWidth="1.5" opacity="0.5">
        <path d={`M ${inset} ${inset + arm} L ${inset} ${inset} L ${inset + arm} ${inset}`} />
        <path d={`M ${right - arm} ${inset} L ${right} ${inset} L ${right} ${inset + arm}`} />
        <path
          d={`M ${right} ${bottom - arm} L ${right} ${bottom} L ${right - arm} ${bottom}`}
        />
        <path
          d={`M ${inset + arm} ${bottom} L ${inset} ${bottom} L ${inset} ${bottom - arm}`}
        />
      </g>
    </>
  )
}

const COMPOSITIONS = {
  catalogue: Catalogue,
  pipeline: Pipeline,
  module: ModuleField,
}

/**
 * The large visual area for a project.
 *
 * WHY AN ABSTRACT PLATE RATHER THAN A SCREENSHOT
 * No screenshots of these projects exist, and fabricating product UI would
 * misrepresent work that has not been shown. Instead each plate is a structural
 * abstraction chosen from what the project actually is — a catalogue, a
 * pipeline, a module field — drawn in the same hairline language as the rest of
 * the page.
 *
 * It is static SVG rather than canvas: resolution-independent, crisp at any
 * size, and with no render loop to pause, throttle or leak. Nothing here
 * animates on its own, so reduced-motion needs no special case.
 *
 * Decorative only — the project name and summary carry the meaning, so the
 * whole plate is hidden from assistive technology.
 */
export function ProjectPlate({ seed, variant = 'catalogue', className = '' }) {
  const Composition = COMPOSITIONS[variant] ?? Catalogue

  const content = useMemo(
    () => <Composition random={createRandom(seed)} />,
    [Composition, seed],
  )

  return (
    // `slice` rather than `meet`: the plate fills its stage and is cropped at the
    // edges. `meet` would letterbox, leaving dead bands that read as a rendering
    // fault. Every composition is drawn with a quiet perimeter for exactly this
    // reason, so a crop trims margin rather than content.
    <svg
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      role="presentation"
      focusable="false"
    >
      {content}
    </svg>
  )
}