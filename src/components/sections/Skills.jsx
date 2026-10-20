import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { skillIcons } from '../ui/skillIconMap.js'
import { skillGroups } from '../../data/site.js'

/**
 * SKILLS — the toolkit, grouped.
 *
 * A six-entry specification grid, one per category. The grouping is the
 * point: a flat wall of chips hides which technologies belong together, and
 * a reader trying to work out whether this person has done backend work
 * should not have to guess.
 *
 * HOVER
 * The shared hover-pop: a 4px lift, slight scale, accent hairline and
 * shadow, applied through the `.pop` utility in utilities.css so this card
 * behaves exactly like every other interactive surface on the page. The
 * transform, its gates (`(hover: hover)` and `prefers-reduced-motion`) and
 * its colours all live in that one utility — nothing hover-related is
 * component-specific here, which is what keeps the affordance identical
 * everywhere it appears.
 *
 * THE ENTRIES
 * Editorial specification rows: a gold index numeral and a teal marker up
 * top, the category as a confident heading, then quiet mono tags separated
 * by hairlines rather than boxed pills. Deliberately not pills — the brief
 * rules out pill-heavy UI, and a field of fully-rounded chips is the single
 * clearest signal of a template.
 */
export function Skills() {
  return (
    <Section id="skills" labelledBy="skills-heading">
      <Container width="wide">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal as="p" className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-ink uppercase">
            <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
            <span className="section-index" data-index="02">Toolkit</span>
            <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
          </Reveal>

          <Reveal as="h2" id="skills-heading" className="text-display-sm text-foreground-strong">
            Skills <span className="font-display italic">&amp; stack</span>
          </Reveal>

          <Reveal as="p" className="mx-auto max-w-[54ch] text-body text-muted">
            The languages, frameworks and tools this work is actually built
            with, grouped by what they are used for.
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = skillIcons[group.id]

            return (
              <Reveal as="li" key={group.id} delay={index * 0.04}>
                <div
                  className={[
                    'group pop h-full border-t-2 border-t-accent/70 border-b border-b-border bg-surface/60 px-1 pb-6 pt-5',
                  ].join(' ')}
                >
                  <div className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="font-mono text-micro text-gilt">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {Icon && (
                      <span className="grid size-9 shrink-0 translate-y-1 place-items-center rounded-sm border border-border bg-background text-accent-ink">
                        <Icon className="size-4" />
                      </span>
                    )}

                    <h3 className="text-title text-foreground-strong">{group.label}</h3>
                  </div>

                  <ul className="mt-4 flex flex-col divide-y divide-border/70">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={[
                          'flex items-baseline gap-2 py-1.5',
                          'font-mono text-caption text-muted-strong',
                          'transition-colors duration-200 group-hover:text-foreground',
                        ].join(' ')}
                      >
                        <span aria-hidden="true" className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-secondary/80" />
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