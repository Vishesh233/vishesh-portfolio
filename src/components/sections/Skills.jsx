import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { skillIcons } from '../ui/skillIconMap.js'
import { skillGroups } from '../../data/site.js'

/**
 * SKILLS — the toolkit, grouped.
 *
 * A six-card grid, one per category. The grouping is the point: a flat wall of
 * chips hides which technologies belong together, and a reader trying to work
 * out whether this person has done backend work should not have to guess.
 *
 * HOVER
 * The shared hover-pop: a 4px lift, slight scale, cyan hairline and shadow,
 * applied through the `.pop` utility in utilities.css so this card behaves
 * exactly like every other interactive surface on the page. The transform,
 * its gates (`(hover: hover)` and `prefers-reduced-motion`) and its colours
 * all live in that one utility — nothing hover-related is component-specific
 * here, which is what keeps the affordance identical everywhere it appears.
 *
 * THE CHIPS
 * Flat, 6px radius, hairline border. Deliberately not pills — the brief rules
 * out pill-heavy UI, and a field of fully-rounded chips is the single clearest
 * signal of a template. Each chip runs the stronger hover-pop (`pop-strong`,
 * 1.04) like every other small target on the page.
 */
export function Skills() {
  return (
    <Section id="skills" labelledBy="skills-heading">
      <Container width="wide">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal as="p" className="font-mono text-micro tracking-widest text-accent-ink uppercase">
            Toolkit
          </Reveal>

          <Reveal as="h2" id="skills-heading" className="text-display-sm text-foreground-strong">
            Skills
          </Reveal>

          <Reveal as="p" className="mx-auto max-w-[54ch] text-body text-muted">
            The languages, frameworks and tools this work is actually built
            with, grouped by what they are used for.
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = skillIcons[group.id]

            return (
              <Reveal as="li" key={group.id} delay={index * 0.04}>
                <div
                  className={[
                    'group pop h-full rounded-md border border-border bg-surface p-6',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-border bg-background text-accent-ink">
                        <Icon className="size-5" />
                      </span>
                    )}

                    <h3 className="text-title text-foreground-strong">{group.label}</h3>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={[
                          'pop-strong rounded-sm border border-border bg-background px-2.5 py-1',
                          'font-mono text-caption text-muted-strong',
                          'group-hover:border-border-strong',
                        ].join(' ')}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}