import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ActionLink } from '../ui/ActionLink.jsx'
import { Portrait } from '../ui/Portrait.jsx'
import { ExternalIcon } from '../ui/Icons.jsx'
import { about, aboutCards, skillGroups, site, stats } from '../../data/site.js'

/**
 * ABOUT — the background.
 *
 * COMPOSITION
 * A large portrait on the left, the narrative on the right. The right column
 * carries, in order: the eyebrow, the heading with its section numeral, one
 * short paragraph, the three info cards, the stat row, a condensed skill
 * list and the resume link — so a reader skimming the column gets the story,
 * then the evidence, then the tools.
 *
 * THE STAT ROW
 * The three numbers come from the `stats` registry, which derives them from
 * `projects` and `certifications` rather than hard-coding them. There is no
 * fourth tile, because there is no fourth verified number to put in it.
 * Stats read as editorial figures separated by hairlines — not boxed tiles —
 * with the number warming on hover (see the stat-tile block in
 * utilities.css).
 *
 * THE SKILL LIST HERE IS CONDENSED
 * About shows the group names with their item counts, not every item — the
 * full breakdown is the Skills section's job. Repeating 20 chips in both places
 * would make one of them redundant.
 */
export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <Container width="wide">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------------ PORTRAIT */}
          <div className="lg:col-span-5">
            <Reveal>
              <Portrait
                shape="panel"
                size="w-full max-w-sm"
                className="mx-auto lg:sticky lg:top-[calc(var(--header-height)+2rem)]"
              />
            </Reveal>
          </div>

          {/* -------------------------------------------------------- NARRATIVE */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <Reveal as="p" className="flex items-center justify-center gap-3 font-mono text-micro tracking-widest text-accent-ink uppercase">
              <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
              <span className="section-index" data-index="01">About</span>
              <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
            </Reveal>

            <Reveal as="h2" id="about-heading" className="text-center text-display-sm text-foreground-strong">
              About <span className="font-display italic">me</span>
            </Reveal>

            <Reveal as="p" className="mx-auto max-w-[54ch] text-center text-lead text-muted">
              {about.lead}
            </Reveal>

            {/* The three cards. Each dot picks a different accent so the set
                reads as three related but distinct statements: teal/blue,
                lavender, and the tertiary support note. `info-dot` and
                `info-label` are the hooks utilities.css uses for the hover
                bloom and the label brighten. The first card carries the
                accent spine. */}
            <ul className="grid gap-4 sm:grid-cols-3">
              {aboutCards.map((card, cardIndex) => (
                <Reveal
                  as="li"
                  key={card.id}
                  className={`card pop flex flex-col gap-3 p-5 ${cardIndex === 0 ? 'card-spine pl-6' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`info-dot size-2 rounded-full ${
                        {
                          accent: 'bg-accent',
                          secondary: 'bg-secondary',
                          ink: 'bg-tertiary',
                        }[card.dot]
                      }`}
                    />
                    <span className="info-label font-mono text-caption tracking-tight text-foreground-strong transition-colors duration-200">
                      {card.label}
                    </span>
                  </span>

                  <p className="text-body-sm text-muted">{card.body}</p>
                </Reveal>
              ))}
            </ul>

            {/* Stat row. Real numbers only — see the note above. An editorial
                figure row with hairline separators, not boxed tiles; each
                figure still lifts its number on hover exactly like every
                other surface. */}
            <Reveal
              as="dl"
              className="grid grid-cols-3 divide-x divide-border border-y border-border"
            >
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="stat-tile card pop flex flex-col items-center gap-1 px-2 py-6 text-center"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="stat-value font-display text-[2.5rem] leading-none text-foreground-strong transition-colors duration-200">
                    {stat.value}
                  </dd>
                  <dd
                    aria-hidden="true"
                    className="font-mono text-micro tracking-tight text-gilt uppercase"
                  >
                    {stat.label}
                  </dd>
                </div>
              ))}
            </Reveal>

            {/* Condensed skill list — group names with counts, not every item.
                Editorial separators, not boxed pills: quiet text with gold
                counts. */}
            <div className="flex flex-col gap-4">
              <Reveal
                as="p"
                className="font-mono text-micro tracking-widest text-subtle uppercase"
              >
                Works with
              </Reveal>

              <Reveal as="ul" className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                {skillGroups.map((group) => (
                  <li
                    key={group.id}
                    className="font-mono text-caption text-muted-strong transition-colors duration-200 hover:text-accent-ink"
                  >
                    {group.label}
                    <span aria-hidden="true" className="text-gilt ml-1.5">
                      {String(group.items.length).padStart(2, '0')}
                    </span>
                    <span className="sr-only"> items</span>
                  </li>
                ))}
              </Reveal>
            </div>

            {/* Opens the PDF in a new tab rather than downloading it, so the
                page survives and the visitor can keep reading afterwards. */}
            <Reveal>
              <ActionLink
                href={site.resumeUrl}
                external
                icon={<ExternalIcon className="ml-1 size-4" />}
                arrow={false}
              >
                View Resume
              </ActionLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}