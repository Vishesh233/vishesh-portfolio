/**
 * Icon set.
 *
 * Hand-rolled inline SVG rather than an icon dependency. The whole site needs
 * about a dozen glyphs, and a library would add a package, a build-time cost
 * and a barrel import for shapes that are two or three paths each.
 *
 * EVERY icon here is `aria-hidden`. None of them carries meaning on its own —
 * the accessible name always comes from the link or button that wraps it, or
 * from a visually hidden span. `focusable="false"` stops older Edge from
 * putting them in the tab order independently of their container.
 *
 * All glyphs are drawn on a 24x24 grid with a consistent 1.75 stroke, so they
 * sit together at the same optical weight.
 */

/** Shared wrapper: sizing, stroke defaults and accessibility are set once. */
export function Svg({ children, className, filled = false, viewBox = '0 0 24 24' }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function GithubIcon({ className }) {
  return (
    <Svg className={className} filled viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </Svg>
  )
}

export function LinkedinIcon({ className }) {
  return (
    <Svg className={className} filled>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </Svg>
  )
}

export function MailIcon({ className }) {
  return (
    <Svg className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 7 8.1 5.6a1.5 1.5 0 0 0 1.8 0L21 7" />
    </Svg>
  )
}

export function CopyIcon({ className }) {
  return (
    <Svg className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </Svg>
  )
}

export function CheckIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Svg>
  )
}

export function AlertIcon({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.2v.3" />
    </Svg>
  )
}

export function CloseIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function CapIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 4.5 2.75 9 12 13.5 21.25 9 12 4.5Z" />
      <path d="M6.75 11.4v4.1c0 1.5 2.35 2.75 5.25 2.75s5.25-1.25 5.25-2.75v-4.1" />
      <path d="M21.25 9v5.25" />
    </Svg>
  )
}

export function AwardIcon({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="9.25" r="5.25" />
      <path d="m9.1 13.75-1.5 6 4.4-2.35 4.4 2.35-1.5-6" />
    </Svg>
  )
}

/**
 * School building — the school-level education node on the timeline (the
 * college node is CapIcon). Also general architecture; it carries no meaning
 * on its own, per the header note.
 */
export function BuildingIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M4.5 20.5h15" />
      <path d="M6.5 20.5V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15.5" />
      <path d="M9.5 7.5h1.5M13 7.5h1.5M9.5 11h1.5M13 11h1.5M9.5 14.5h1.5M13 14.5h1.5" />
      <path d="M10.5 20.5v-3h3v3" />
    </Svg>
  )
}

/** Calendar — the date range in an education card's footer. */
export function CalendarIcon({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </Svg>
  )
}

export function ArrowIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  )
}

/** Down chevron — the hero's scroll-down hint. */
export function ChevronIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 9.5 12 15.5l6-6" />
    </Svg>
  )
}

export function DownloadIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 16.5v2A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2v-2" />
    </Svg>
  )
}

export function ExternalIcon({ className }) {
  return (
    <Svg className={className}>
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14.5v4A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </Svg>
  )
}