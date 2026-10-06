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
        <div className="flex flex-col gap-4">
          <Reveal as="p" className="font-mono text-micro tracking-widest text-subtle uppercase">
            Contact
          </Reveal>

          <Reveal as="h2" id="contact-heading" className="text-display-sm text-foreground-strong">
            Get In Touch
          </Reveal>

          <Reveal as="p" className="max-w-[54ch] text-body text-muted">
            Send a message through the form below, or reach out directly by
            email, GitHub or LinkedIn.
          </Reveal>
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-8">
          <Reveal className="card p-6 sm:p-8">
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