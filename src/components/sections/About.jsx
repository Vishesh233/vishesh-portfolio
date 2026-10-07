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
 * carries, in order: the heading, one short paragraph, the three info cards,
 * the stat tiles, a condensed skill list and the resume link — so a reader
 * skimming the column gets the story, then the evidence, then the tools.
 *
 * THE STAT TILES
 * The three numbers come from the `stats` registry, which derives them from
 * `projects` and `certifications` rather than hard-coding them. There is no
 * fourth tile, because there is no fourth verified number to put in it.
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
            <Reveal as="p" className="text-center font-mono text-micro tracking-widest text-accent-ink uppercase">
              About
            </Reveal>

            <Reveal as="h2" id="about-heading" className="text-center text-display-sm text-foreground-strong">
              About me
            </Reveal>

            <Reveal as="p" className="mx-auto max-w-[54ch] text-center text-lead text-muted">
              {about.lead}
            </Reveal>

            {/* The three cards. Each dot picks a different accent so the set
                reads as three related but distinct statements. */}
            <ul className="grid gap-4 sm:grid-cols-3">
              {aboutCards.map((card) => (
                <Reveal
                  as="li"
                  key={card.id}
                  className="card pop flex flex-col gap-3 p-5"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${
                        {
                          accent: 'bg-accent',
                          secondary: 'bg-secondary',
                          ink: 'bg-accent-ink',
                        }[card.dot]
                      }`}
                    />
                    <span className="font-mono text-caption tracking-tight text-foreground-strong">
                      {card.label}
                    </span>
                  </span>

                  <p className="text-body-sm text-muted">{card.body}</p>
                </Reveal>
              ))}
            </ul>

            {/* Stat tiles. Real numbers only — see the note above. */}
            <Reveal
              as="dl"
              className="grid grid-cols-3 gap-4 border-y border-border py-6"
            >
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col gap-1">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-[2.5rem] leading-none text-accent-ink">
                    {stat.value}
                  </dd>
                  <dd
                    aria-hidden="true"
                    className="font-mono text-micro tracking-tight text-subtle uppercase"
                  >
                    {stat.label}
                  </dd>
                </div>
              ))}
            </Reveal>

            {/* Condensed skill list — group names with counts, not every item. */}
            <div className="flex flex-col gap-4">
              <Reveal
                as="p"
                className="font-mono text-micro tracking-widest text-subtle uppercase"
              >
                Works with
              </Reveal>

              <Reveal as="ul" className="flex flex-wrap gap-2">
                {skillGroups.map((group) => (
                  <li
                    key={group.id}
                    className="pop-strong rounded-sm border border-border bg-surface px-3 py-1.5 font-mono text-caption text-muted-strong"
                  >
                    {group.label}
                    <span aria-hidden="true" className="ml-2 text-subtle">
                      {group.items.length}
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