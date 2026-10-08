import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { AwardIcon, BuildingIcon, CalendarIcon, CapIcon } from '../ui/Icons.jsx'
import { certifications, education } from '../../data/site.js'

/**
 * EDUCATION — a centre-line timeline, then certifications as a row.
 *
 * WHY THE TIMELINE IS AN ARRAY LOOP
 * `education` is a list in the data file (newest first), so a second entry
 * renders itself: the gradient rail is one pseudo-element on the list and each
 * entry positions its own round icon node against that rail. Left/right
 * alternation is derived from the index — even entries land left of the rail,
 * odd entries right — and below `lg` every card stacks to the right of the
 * rail, so the same data drives both presentations.
 *
 * NODES AND FOOTERS ARE DATA-SHAPED
 * `level` picks the node glyph (graduation cap for college, school building
 * for school); the footer shows the degree — or the class and board for a
 * school entry — on the left and the date range with a calendar icon on the
 * right. No location text: the data file carries none, and inventing one would
 * break the content policy.
 *
 * NO INFERRED DETAIL
 * Dates, coursework and the problem-count note are the supplied facts. The two
 * Forage entries are labelled "Virtual experience program" because that is
 * what they are — presenting them as certificates would overstate them, and
 * the label is the difference a reader needs.
 */
export function Education() {
  return (
    <Section id="education" labelledBy="education-heading">
      <Container width="wide">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal as="p" className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-ink uppercase">
            <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
            <span className="section-index" data-index="03">Background</span>
            <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
          </Reveal>

          <Reveal as="h2" id="education-heading" className="text-display-sm text-foreground-strong">
            Educat<span className="font-display italic">ion</span>
          </Reveal>

          <Reveal as="p" className="mx-auto max-w-[54ch] text-body text-muted">
            Where the fundamentals came from, and the programmes completed
            alongside coursework.
          </Reveal>
        </div>

        {/* Centre-line timeline. One gradient rail on the list, one round icon
            node per entry — both defined in utilities.css, so the alternating
            layout lives in one place rather than in per-entry markup. */}
        <ol className="timeline mt-12">
          {education.map((entry, index) => (
            <TimelineEntry key={entry.id} entry={entry} index={index} />
          ))}
        </ol>

        <Certifications />
      </Container>
    </Section>
  )
}

/**
 * One timeline entry: the card, then the node (absolutely positioned against
 * the rail, so DOM order is free to follow reading order — card first).
 *
 * The card carries the shared hover-pop plus the cursor light like every other
 * box on the page; hovering it also blooms the node and brightens the label,
 * which is the visual pairing between "this card" and "this point on the rail".
 */
function TimelineEntry({ entry, index }) {
  const isLeft = index % 2 === 0

  // College entries show the programme; school entries show class and board
  // ("Class XII · CBSE"). Both come straight from the data file.
  const qualification =
    entry.degree ?? [entry.class, entry.board].filter(Boolean).join(' · ')

  const NodeIcon = entry.level === 'school' ? BuildingIcon : CapIcon

  // Whatever the data file actually supplies: a full range when both ends
  // exist, the bare end year ("2020") when only that was given — never a
  // leading dash or an invented start date.
  const dateRange = [entry.start, entry.end].filter(Boolean).join(' – ')

  return (
    <Reveal as="li" delay={index * 0.04} className="timeline-item">
      <article
        className={[
          'timeline-card card pop card-spine flex h-full flex-col gap-4 p-6 pl-7',
          // Desktop alternation: the column the card fills. Mobile stacks every
          // card to the right of the rail, so these only apply at lg+.
          isLeft ? 'lg:col-start-1' : 'lg:col-start-2',
        ].join(' ')}
      >
        <div className="flex flex-col gap-1">
          <p aria-hidden="true" className="font-mono text-micro tracking-widest text-gilt">
            {String(index + 1).padStart(2, '0')} — {entry.end ?? entry.start}
          </p>
          <h3 className="timeline-label text-title text-foreground-strong transition-colors duration-200">
            {entry.name}
          </h3>

          {entry.coursework?.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2">
              {entry.coursework.map((item) => (
                <li
                  key={item}
                  className="font-mono text-caption text-muted-strong"
                >
                  <span aria-hidden="true" className="text-gilt mr-1.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {entry.note && (
          <p className="font-mono text-caption text-subtle">{entry.note}</p>
        )}

        {/* Footer: qualification (plus optional percentage badge) left,
            calendar icon and date range right. No location text.

            A plain div, not <footer>: a second footer-shaped element would
            present as another contentinfo landmark to assistive tech, and
            the row is presentational — the cert cards use divs the same
            way. */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-4">
          <span className="flex flex-wrap items-center gap-2">
            {qualification && (
              <span className="text-body-sm text-muted-strong">
                {qualification}
              </span>
            )}
            {entry.percentage && (
              <span className="rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-caption text-accent-ink">
                {entry.percentage}
              </span>
            )}
          </span>

          <span className="flex items-center gap-2 font-mono text-caption text-subtle">
            <CalendarIcon className="size-4" />
            {dateRange}
          </span>
        </div>
      </article>

      {/* The node sits on the rail, centred against the card's heading. */}
      <span aria-hidden="true" className="timeline-node">
        <NodeIcon className="size-4" />
      </span>
    </Reveal>
  )
}

/**
 * Certifications, as a single row of three cards below the timeline.
 *
 * Split into its own component so each list keeps one heading level:
 * `Education` is the h2, this is the h3 and the cards beneath are h4s — a flat
 * run of h3s would hide the grouping.
 */
function Certifications() {
  return (
    <div className="mt-16 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-sm border border-secondary/40 bg-surface text-gilt"
        >
          <AwardIcon className="size-4" />
        </span>
        <h3 className="text-title text-foreground-strong">Certifications</h3>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {certifications.map((cert, index) => (
          <Reveal as="li" key={cert.id} delay={index * 0.05}>
            <article className="card pop h-full border-t-2 border-t-secondary/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-micro tracking-widest text-gilt uppercase">
                  {cert.kind === 'virtual-experience'
                    ? 'Virtual experience program'
                    : 'Certification'}
                </span>
                <span className="font-mono text-caption text-subtle">{cert.year}</span>
              </div>

              <h4 className="mt-3 text-body-strong text-foreground-strong">{cert.title}</h4>
              <p className="mt-1 font-mono text-caption text-muted">
                {cert.issuer} · {cert.platform}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}