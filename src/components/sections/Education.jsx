import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { AwardIcon, BuildingIcon, CapIcon } from '../ui/Icons.jsx'
import { certifications, education, leadership } from '../../data/site.js'

/**
 * EDUCATION — a timeline, then certifications and leadership side by side.
 *
 * WHY THE TIMELINE IS AN ARRAY LOOP
 * `education` is a list in the data file, so a second entry renders itself;
 * the rail is one border on the list and each entry positions its own accent
 * dot against that rail. No per-entry rail markup to keep in sync.
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
          <Reveal as="p" className="font-mono text-micro tracking-widest text-accent-ink uppercase">
            Background
          </Reveal>

          <Reveal as="h2" id="education-heading" className="text-display-sm text-foreground-strong">
            Education
          </Reveal>

          <Reveal as="p" className="mx-auto max-w-[54ch] text-body text-muted">
            Where the fundamentals came from, the programmes completed alongside
            coursework, and the clubs that put them to use.
          </Reveal>
        </div>

        {/* Timeline. One rail on the list, one dot per entry. */}
        <ol className="mt-12 border-l border-border pl-8 sm:pl-10">
          {education.map((entry) => (
            <Reveal as="li" key={entry.id} className="relative last:pb-0 pb-10">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-8 size-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background sm:-left-10"
              />

              <div className="flex flex-col gap-3">
                <p className="font-mono text-caption text-accent-ink">
                  {entry.startMonth} – {entry.endMonth}
                </p>

                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-sm border border-border bg-surface text-accent-ink"
                  >
                    <CapIcon className="size-4" />
                  </span>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-title text-foreground-strong">{entry.institution}</h3>
                    <p className="text-body-sm text-muted">{entry.degree}</p>
                  </div>
                </div>

                <ul className="flex flex-wrap gap-2 pl-12">
                  {entry.coursework.map((item) => (
                    <li
                      key={item}
                      className="rounded-sm border border-border bg-background px-2.5 py-1 font-mono text-caption text-muted-strong"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="pl-12 font-mono text-caption text-subtle">{entry.note}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <CertificationsAndLeadership />
      </Container>
    </Section>
  )
}

/**
 * The two columns below the timeline. Split into its own component so each
 * list keeps one heading level: `Education` is the h2, these are h3s and the
 * cards beneath them are h4s — a flat run of h3s would hide the grouping.
 */
function CertificationsAndLeadership() {
  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-sm border border-border bg-surface text-accent-ink"
          >
            <AwardIcon className="size-4" />
          </span>
          <h3 className="text-title text-foreground-strong">Certifications</h3>
        </div>

        <ul className="flex flex-col gap-4">
          {certifications.map((cert, index) => (
            <Reveal as="li" key={cert.id} delay={index * 0.05}>
              <article className="card pop h-full p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-micro tracking-widest text-muted uppercase">
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

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-sm border border-border bg-surface text-accent-ink"
          >
            <BuildingIcon className="size-4" />
          </span>
          <h3 className="text-title text-foreground-strong">Leadership</h3>
        </div>

        <ul className="flex flex-col gap-4">
          {leadership.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 0.05}>
              <article className="card pop h-full p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-body-strong text-foreground-strong">{item.organisation}</h4>
                  <span className="font-mono text-caption text-accent-ink">{item.role}</span>
                </div>

                {item.detail && <p className="mt-1 text-body-sm text-muted">{item.detail}</p>}

                <ul className="mt-3 flex flex-col gap-1.5">
                  {item.activities.map((activity) => (
                    <li key={activity} className="flex items-start gap-2 text-body-sm text-muted">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {activity}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}