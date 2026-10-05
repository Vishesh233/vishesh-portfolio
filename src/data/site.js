/**
 * Site identity and verified content.
 *
 * CONTENT POLICY
 * This file is the single source of truth for anything factual. Only
 * confirmed facts live here — no invented metrics, dates, links, testimonials
 * or achievements. Fields that are genuinely unknown are `null`, which makes
 * them impossible to render by accident and impossible to mistake for real
 * data. Fill them in when the details are supplied.
 */

export const site = {
  name: 'Vishesh Khanna',
  shortName: 'VK',
  roles: ['Software Engineer', 'Full-Stack Developer', 'Python Developer'],
  location: null,
  email: null,
  github: null,
  linkedin: null,
  resumeUrl: null,
}

/**
 * Section registry.
 *
 * Drives both the scroll-spy navigation and the section anchors, so the two
 * can never drift apart. Ids match the planned page structure and are used by
 * the future smooth-scroll layer.
 */
export const sections = [
  { id: 'hero', label: 'Index' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Primary navigation.
 *
 * An explicit, ordered subset of the `sections` registry above. It is declared
 * separately rather than derived from `sections` because the two need
 * different things: the registry is the full page structure, while this is the
 * short list a visitor actually navigates by, in reading order.
 *
 * Keeping the ids identical to the registry means a link can never point at a
 * section that does not exist in the structure — only at one that has not been
 * built yet.
 */
export const nav = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Verified projects.
 *
 * `category` restates the verified `summary` below it — it is a label derived
 * from information already on record, not new information.
 *
 * `href` and `repository` are `null` because no live or repository URL has been
 * supplied. They stay `null` rather than being guessed, and every consumer
 * treats a null link as "do not render a link at all".
 */
export const projects = [
  {
    id: 'libverse',
    name: 'LibVerse',
    summary: 'Full-stack role-based library management system.',
    category: 'Full-Stack Application',
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    href: null,
    repository: null,
  },
  {
    id: 'interviewpilot',
    name: 'InterviewPilot',
    summary: 'AI-powered interview preparation platform.',
    category: 'Web Platform',
    stack: ['React', 'Node.js', 'AI/API integrations'],
    href: null,
    repository: null,
  },
  {
    id: 'qr-code-studio',
    name: 'QR Code Studio v2',
    summary: 'Python desktop GUI application for QR code generation and scanning.',
    category: 'Desktop Application',
    stack: ['Python', 'CustomTkinter'],
    href: null,
    repository: null,
  },
]

/**
 * About section content.
 *
 * FACTS ONLY — same policy as the rest of this file. Every string below is
 * either supplied directly or restated from `projects`/`experience`/`site`
 * above; nothing here is an inference, a personality claim or a career claim.
 *
 * `statement` is the single editorial line. It is deliberately written in the
 * third person and describes only what is already on record: the target roles
 * and the categories of work actually built. It asserts no traits, no years of
 * experience, no outcomes and no aspirations.
 *
 * `field` and `status` are separate nullable fields rather than one pre-joined
 * string, so the Education section can consume them independently once real
 * detail (degree, institution, dates) is supplied. Until then they are `null`
 * here and simply do not render — an unfilled field must never degrade into
 * placeholder copy.
 */
export const about = {
  statement:
    'A computer science graduate building full-stack web applications and Python desktop tools — across role-based systems, API-integrated platforms and desktop interfaces.',
  field: 'Computer Science',
  status: 'Graduate · Fresher',
  focus: 'Full-Stack · Python',
}

/** Verified experience. Dates are supplied separately. */
export const experience = [
  {
    id: 'editopia',
    role: 'Web Development Intern',
    company: 'Editopia Production',
    start: null,
    end: null,
    summary: null,
  },
]

/** Education details are supplied separately. */
export const education = []

/** Contact channels, populated only once verified. */
export const contact = {
  email: null,
  github: null,
  linkedin: null,
}