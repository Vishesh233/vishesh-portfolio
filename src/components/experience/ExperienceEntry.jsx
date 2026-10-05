import { Reveal } from '../motion/Reveal.jsx'
import { formatDateRange } from '../../lib/utils.js'

/**
 * One professional engagement, presented as an editorial record.
 *
 * DIFFERENT FROM A PROJECT STAGE, ON PURPOSE
 * Projects uses large plates of artwork because the work is visual. A job has no
 * artefact to show, so this entry is built purely from type and rules: the role
 * is the display element, the organisation is set beneath it in italic serif,
 * and the verified facts sit in a narrow ruled column. Nothing decorative is
 * invented to fill the space a plate would occupy — the emptiness is the honest
 * representation of what is actually on record.
 *
 * DATA DISCIPLINE
 * Every field here is conditional. `start`, `end` and `summary` are all null on
 * the current record, so the period row and the description simply do not
 * render. `formatDateRange` returns null rather than an em dash for exactly this
 * reason: an unknown date must never become a plausible-looking one.
 *
 * This is what makes the component safe to reuse — supply a start date and the
 * period row appears on its own, with no change here.
 */
export function ExperienceEntry({ record, index }) {
  const number = String(index + 1).padStart(2, '0')
  const headingId = `experience-${record.id}-title`

  // Null unless real dates exist. Never a placeholder.
  const period = formatDateRange(record.start, record.end)

  return (
    <article
      aria-labelledby={headingId}
      className="relative grid grid-cols-1 gap-x-12 gap-y-10 border-t border-border py-16 md:py-24 lg:grid-cols-12 lg:gap-y-0 lg:py-28"
    >
      {/*
        Entry numeral. Carries the editorial "index" reading that Projects uses
        for its stages, but set smaller and held in the outer margin so this
        section stays quieter than the work it follows.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 right-0 select-none font-display text-[3.5rem] leading-none tracking-tighter text-foreground opacity-[0.07] lg:-top-3 lg:left-0 lg:text-[6rem]"
      >
        {number}
      </span>

      {/* The role. The single largest element in the section — this is the fact
          a reader came for. */}
      <div className="flex flex-col items-start gap-5 lg:col-span-7 lg:col-start-1 lg:row-start-1">
        {/*
          The eyebrow carries the organisation's context, not the word
          "Experience" — the section heading directly above already says that,
          and repeating it would be noise rather than information. With no
          verified employment type on record, this reads the *relationship*
          instead, which is true of any single engagement and is stated nowhere
          else on the page.
        */}
        <Reveal
          as="p"
          className="flex items-center gap-3 font-mono text-micro uppercase tracking-widest text-accent"
        >
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          Professional Record
        </Reveal>

        <Reveal
          as="h3"
          delay={0.06}
          id={headingId}
          className="max-w-[20ch] font-display text-display-sm text-foreground-strong"
        >
          {record.role}
        </Reveal>

        {/*
          The organisation. Italic serif mirrors the hero's treatment of the
          second half of the name, so the two sections share one typographic
          gesture rather than each inventing its own.
        */}
        {record.company && (
          <Reveal
            as="p"
            delay={0.12}
            className="pl-[0.08em] font-display text-title italic text-muted-strong"
          >
            {record.company}
          </Reveal>
        )}

        {record.summary && (
          <Reveal as="p" delay={0.18} className="max-w-[44ch] text-body text-muted">
            {record.summary}
          </Reveal>
        )}
      </div>

      {/*
        Verified facts, in the outer margin.

        The column is rendered whenever *any* row has real data, and each row
        renders independently. With no dates and no summary on the current
        record, nothing at all is emitted rather than a column of empty labels.
      */}
      {(period || record.summary) && (
        <Reveal
          as="dl"
          delay={0.2}
          className="flex w-full flex-col self-start font-mono lg:col-span-4 lg:col-start-9 lg:row-start-1"
        >
          {period && (
            <div className="flex items-baseline justify-between gap-6 border-t border-border py-3">
              <dt className="shrink-0 text-micro uppercase tracking-widest text-subtle">
                Period
              </dt>
              <dd className="text-caption text-muted-strong">{period}</dd>
            </div>
          )}

          <div aria-hidden="true" className="border-t border-border" />
        </Reveal>
      )}
    </article>
  )
}