import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { ProjectCard } from '../projects/ProjectCard.jsx'
import { ProjectModal } from '../projects/ProjectModal.jsx'
import { projects } from '../../data/site.js'

/**
 * PROJECTS — the selected work.
 *
 * COMPOSITION
 * Three cards in a responsive grid, in the order they appear in the data file.
 * Each card is a real button that opens a modal; nothing on this section
 * navigates away.
 *
 * FOCUS MANAGEMENT — the part that is easy to get wrong
 * Opening the modal records which card opened it, in a ref rather than state:
 * it is not rendered, and putting it in state would cause a re-render at the
 * exact moment the dialog is taking focus. On close, that recorded card gets
 * focus back. Without it, a keyboard user who opens a dialog and closes it is
 * dropped at the top of the document and has to tab through the entire page
 * again to return to where they were.
 *
 * PREVIOUS / NEXT WRAP
 * The list is treated as a cycle rather than a range. At the last project,
 * "Next" returns to the first — a dead-ended control in a three-item carousel
 * wastes a click, and the dialog is dismissed and reopened each time anyway, so
 * there is no sense of "running off the end".
 *
 * RENDER ORDER
 * The modal is rendered through AnimatePresence so it can animate out on
 * close. It is mounted into document.body by the modal itself.
 */
export function Projects() {
  const [openIndex, setOpenIndex] = useState(null)
  const cardRefs = useRef([])

  const openProject = projects[openIndex]

  const previousProject =
    projects[(openIndex - 1 + projects.length) % projects.length]

  const nextProject = projects[(openIndex + 1) % projects.length]

  const closeModal = useCallback(() => {
    // Capture before clearing: after setState the index is null, so the card to
    // restore focus to would be gone.
    const index = openIndex

    setOpenIndex(null)

    if (index !== null) {
      // After the dialog unmounts and releases the focus trap.
      requestAnimationFrame(() => cardRefs.current[index]?.focus())
    }
  }, [openIndex])

  const showPrevious = useCallback(() => {
    setOpenIndex((current) =>
      current === null
        ? null
        : (current - 1 + projects.length) % projects.length,
    )
  }, [])

  const showNext = useCallback(() => {
    setOpenIndex((current) =>
      current === null ? null : (current + 1) % projects.length,
    )
  }, [])

  return (
    <Section id="projects" labelledBy="projects-heading">
      <Container width="wide">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal
            as="p"
            className="font-mono text-micro tracking-widest text-accent-ink uppercase"
          >
            Work
          </Reveal>

          <Reveal
            as="h2"
            id="projects-heading"
            className="text-center text-display-sm text-foreground-strong"
          >
            Featured Projects
          </Reveal>

          <Reveal as="p" className="mx-auto max-w-[54ch] text-body text-muted">
            Three projects, each with a walkthrough of what it does and what it
            is built from.
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              project={project}
              onOpen={() => setOpenIndex(index)}
            />
          ))}
        </ul>
      </Container>

      <AnimatePresence>
        {openProject && (
          <ProjectModal
            key={openProject.id}
            project={openProject}
            previousProject={previousProject}
            nextProject={nextProject}
            onClose={closeModal}
            onPrevious={showPrevious}
            onNext={showNext}
          />
        )}
      </AnimatePresence>
    </Section>
  )
}