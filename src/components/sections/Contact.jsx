import { Container } from '../layout/Container.jsx'
import { Section } from '../layout/Section.jsx'
import { Reveal } from '../motion/Reveal.jsx'
import { CopyEmail } from '../ui/CopyEmail.jsx'
import { ContactForm } from '../ui/ContactForm.jsx'
import { SocialLinks } from '../ui/SocialLinks.jsx'

/**
 * CONTACT — the form, plus every direct channel beside it.
 *
 * WHY BOTH FORM AND ADDRESS
 * The form is the easy path; the visible address and social links are the
 * path that keeps working if the form service ever does not. Nothing on this
 * page depends on a single third party staying configured.
 *
 * The card is centred and capped at `max-w-2xl` because a full-width form
 * reads as an admin panel, and the single column keeps the field order —
 * name, email, message — obvious at every viewport.
 */
export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <Container width="wide">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal as="p" className="flex items-center gap-3 font-mono text-micro tracking-widest text-accent-ink uppercase">
            <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
            <span className="section-index" data-index="05">Contact</span>
            <span aria-hidden="true" className="eyebrow-rule h-px w-6" />
          </Reveal>

          <Reveal as="h2" id="contact-heading" className="text-display-sm text-foreground-strong">
            Get in <span className="font-display italic">touch</span>
          </Reveal>

          <Reveal as="p" className="mx-auto max-w-[54ch] text-body text-muted">
            Send a message through the form below, or reach out directly by
            email, GitHub or LinkedIn.
          </Reveal>
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-8">
          <Reveal className="card pop p-6 sm:p-8">
            <ContactForm />
          </Reveal>

          <Reveal className="flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-caption text-muted">Or reach me directly</p>
            <CopyEmail />
            <SocialLinks />
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}