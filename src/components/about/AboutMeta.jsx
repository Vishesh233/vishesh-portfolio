import { site, projects, experience, about } from '../../data/site.js'

/**
 * The About section's narrow metadata column.
 *
 * A COLOPHON, NOT A STAT BLOCK
 * There are no counters here — no "3+ years", no percentages, no fake metrics.
 * The values are the ones already on record: the target roles from `site.roles`,
 * the count and span of work from `projects`, the internship from `experience`,
 * and the two supplied background facts from `about`.
 *
 * `projects` is mapped rather than reduced to a number, because the languages
 * actually used are verified data and repeating them here is more honest and
 * more useful than a count. `role` and `company` are read from the same
 * registry the Experience section will consume, so the two cannot disagree.
 *
 * EVERY ROW IS CONDITIONAL
 * Rows render only when their data exists. If the internship or the background
 * fields are later removed, the row disappears rather than leaving an empty
 * label or an em-dash placeholder behind.
 */
export function AboutMeta() {
  const languages = [...new Set(projects.flatMap((project) => project.stack ?? []))]

  return (
    <dl className="flex w-full flex-col font-mono">
      {/* Target roles. The only "who I am" claim on the page, and it is verified. */}
      <div className="flex flex-col gap-2 border-t border-border py-4">
        <dt className="text-micro uppercase tracking-widest text-subtle">Roles</dt>
        <dd className="flex flex-col gap-1.5">
          {site.roles.map((role) => (
            <span key={role} className="text-caption text-muted-strong">
              {role}
            </span>
          ))}
        </dd>
      </div>

      {about.field && (
        <div className="flex flex-col gap-2 border-t border-border py-4">
          <dt className="text-micro uppercase tracking-widest text-subtle">Field</dt>
          <dd className="text-caption text-muted-strong">{about.field}</dd>
        </div>
      )}

      {about.status && (
        <div className="flex flex-col gap-2 border-t border-border py-4">
          <dt className="text-micro uppercase tracking-widest text-subtle">Status</dt>
          <dd className="text-caption text-muted-strong">{about.status}</dd>
        </div>
      )}

      {about.focus && (
        <div className="flex flex-col gap-2 border-t border-border py-4">
          <dt className="text-micro uppercase tracking-widest text-subtle">Focus</dt>
          <dd className="text-caption text-muted-strong">{about.focus}</dd>
        </div>
      )}

      {languages.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border py-4">
          <dt className="text-micro uppercase tracking-widest text-subtle">
            Technologies
          </dt>
          <dd className="flex flex-wrap gap-x-2 gap-y-1.5">
            {languages.map((item) => (
              <span key={item} className="text-caption text-muted-strong">
                {item}
              </span>
            ))}
          </dd>
        </div>
      )}

      {projects.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border py-4">
          <dt className="text-micro uppercase tracking-widest text-subtle">Projects</dt>
          <dd className="text-caption text-muted-strong">{projects.length} Built</dd>
        </div>
      )}

      {experience.map((role) => (
        <div
          key={role.id}
          className="flex flex-col gap-2 border-t border-border py-4"
        >
          <dt className="text-micro uppercase tracking-widest text-subtle">
            Experience
          </dt>
          <dd className="flex flex-col gap-1">
            <span className="text-caption text-muted-strong">{role.role}</span>
            {/* The company is only ever as specific as the data allows. */}
            {role.company && (
              <span className="text-micro uppercase tracking-wide text-subtle">
                {role.company}
              </span>
            )}
          </dd>
        </div>
      ))}

      {/* Closes the stack with a rule rather than a border, so the column has a
          defined end even when the rows above it change. */}
      <div aria-hidden="true" className="border-t border-border" />
    </dl>
  )
}