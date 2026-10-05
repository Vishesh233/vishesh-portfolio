import { motion, useReducedMotion } from 'framer-motion'
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
 * A 3px lift plus a coral border. The transform belongs to Framer Motion and
 * the colour to CSS, so the two never fight over the same property — the same
 * split `card-interactive` uses elsewhere.
 *
 * The lift is skipped under `prefers-reduced-motion`: translating a card is
 * movement, and a reduced-motion visitor gets the border-colour change alone,
 * which conveys the same affordance with no motion at all.
 *
 * THE CHIPS
 * Flat, 6px radius, hairline border. Deliberately not pills — the brief rules
 * out pill-heavy UI, and a field of fully-rounded chips is the single clearest
 * signal of a template.
 */
export function Skills() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Section id="skills" labelledBy="skills-heading">
      <Container width="wide">
        <div className="flex flex-col gap-4">
          <Reveal as="p" className="font-mono text-micro tracking-widest text-subtle uppercase">
            Toolkit
          </Reveal>

          <Reveal as="h2" id="skills-heading" className="text-display-sm text-foreground-strong">
            Skills
          </Reveal>

          <Reveal as="p" className="max-w-[54ch] text-body text-muted">
            The languages, frameworks and tools this work is actually built
            with, grouped by what they are used for.
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = skillIcons[group.id]

            return (
              <Reveal as="li" key={group.id} delay={index * 0.04}>
                <motion.div
                  // Hover lift, when motion is welcome.
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  className={[
                    'group h-full rounded-md border border-border bg-surface p-6',
                    'transition-[border-color,box-shadow] duration-200',
                    'hover:border-accent hover:shadow-e3',
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
                          'rounded-sm border border-border bg-background px-2.5 py-1',
                          'font-mono text-caption text-muted-strong',
                          'transition-colors duration-200',
                          'group-hover:border-border-strong',
                        ].join(' ')}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}