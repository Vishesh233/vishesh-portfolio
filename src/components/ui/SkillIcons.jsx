/**
 * One icon per skills category.
 *
 * Each maps to the category id in `skillGroups`, so the Skills section pairs
 * them by key and a new category is a data edit plus an icon rather than a
 * layout change. Drawn on the same 24x24 grid and 1.75 stroke as the social
 * and UI glyphs in Icons.jsx, so the two files read as one set.
 *
 * All `aria-hidden`: the category name is always rendered as real text next to
 * the icon, and an icon beside a visible label would only be announced twice.
 */

import { Svg } from './Icons.jsx'

/** Languages — a pair of angle brackets, the universal syntax mark. */
export function LanguagesIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14" />
    </Svg>
  )
}

/** Frontend — a browser window: the frame everything user-facing is built in. */
export function FrontendIcon({ className }) {
  return (
    <Svg className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M6.5 7h.01M9 7h.01" />
    </Svg>
  )
}

/** Backend — a server rack. */
export function BackendIcon({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="4" width="17" height="6.5" rx="1.5" />
      <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5" />
      <path d="M7 7.2h.01M7 16.7h.01M10.5 7.2h3M10.5 16.7h3" />
    </Svg>
  )
}

/** Databases — stacked discs, read as cylinders. */
export function DatabaseIcon({ className }) {
  return (
    <Svg className={className}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </Svg>
  )
}

/** Tools — a wrench. */
export function ToolsIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M14.5 3.5a5 5 0 0 0-6.3 6.3l-6 6a2.12 2.12 0 0 0 3 3l6-6a5 5 0 0 0 6.3-6.3l-3 3-2.8-.7-.7-2.8 3.5-2.5Z" />
    </Svg>
  )
}

/** Libraries — stacked modules, the shape a dependency graph takes. */
export function LibraryIcon({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M17 13.5v7M13.5 17h7" />
    </Svg>
  )
}