import { Section } from '../layout/Section.jsx'
import { Container } from '../layout/Container.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ExperienceEntry } from '../experience/ExperienceEntry.jsx'
import { experience } from '../../data/site.js'

/**
 * EXPERIENCE — the professional record behind the work.
 *
 * CONTINUITY WITH THE REST OF THE PAGE
 * The same three voices, the same ghosted folio numeral, the same ember eyebrow,
 * the same hairline rules and the same Container/Section/Reveal primitives. No
 * new visual system is introduced: this section is assembled from exactly the
 * parts About and Projects already established.
 *
 * FOLIO ORDER
 * Third in the sequence — About is 01, Projects is 02. The numbering is
 * presentation, not a claim about sequence or seniority.
 *
 * QUIETER THAN PROJECTS, BY DESIGN
 * Projects is the loudest section on the page because the work is the point.
 * Here the only verified facts are a role and an organisation, so the section is
 * deliberately restrained: display type and rules, no plates, no 3D, no
 * parallax, no timeline chrome. Adding visual weight to fill space would imply
 * there is more record here than there actually is.
 *
 * NO TIMELINE UNTIL THERE ARE DATES
 * A vertical rule with nodes implies duration, sequence and progression. None of
 * that is on record, so none of it is drawn. `ExperienceEntry` emits a period
 * row only once real dates are supplied to src/data/site.js.
 */
export function Experience() {
  if (experience.length === 0) return null

  return (
    <Section id="experience" aria-labelledby="experience-heading">
      <Container width="wide">
        {/* Masthead. Third in the matched series opened by About and Projects. */}
        <div className="flex flex-col gap-8 pb-4 md:pb-8">
          <Reveal className="flex items-center gap-4 md:gap-6">
            <span
              aria-hidden="true"
              className="font-display text-[4rem] leading-none tracking-tighter text-foreground opacity-[0.07] select-none md:text-[6rem]"
            >
              03
            </span>

            <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-widest text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Practice
            </p>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.06}
            id="experience-heading"
            className="font-display text-display-md text-foreground-strong"
          >
            Experience
          </Reveal>

          {/*
            The masthead already names the section, so this line carries only what
            the heading cannot: that the record below is the professional context
            for the work shown earlier. It is a navigational statement about this
            page, not a claim about the work itself.
          */}
          <Reveal as="p" delay={0.12} className="max-w-[46ch] text-body text-muted">
            The professional record behind the projects shown above.
          </Reveal>
        </div>

        {experience.map((record, index) => (
          <ExperienceEntry key={record.id} record={record} index={index} />
        ))}
      </Container>
    </Section>
  )
}