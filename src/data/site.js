/**
 * Site identity and verified content.
 *
 * CONTENT POLICY — HARD RULE
 * This file is the single source of truth for anything factual. Only confirmed
 * facts live here. No invented metrics, dates, employers, outcomes or
 * technologies. Where a value is genuinely unknown it is `null`, which makes it
 * impossible to render by accident.
 *
 * Notably absent by design: no phone number, no location, and no Experience
 * section. Every string below was supplied or read directly from a source
 * repository.
 */

export const site = {
  name: 'Vishesh Khanna',
  shortName: 'VK',
  role: 'Full-Stack Software Engineer',

  email: 'visheshkhanna2345@gmail.com',
  github: 'https://github.com/Vishesh233',
  linkedin: 'https://www.linkedin.com/in/vishesh-khanna-210361252/',

  /** Served from public/, so the download attribute works same-origin. */
  resumeUrl: '/Vishesh_Khanna_Resume.pdf',
  resumeFileName: 'Vishesh_Khanna_Resume.pdf',
}

/**
 * Section registry.
 *
 * Drives both the scroll-spy navigation and the anchor ids, so the two cannot
 * drift apart. Order here is the order sections appear on the page.
 */
export const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Primary navigation — the full `sections` registry, in reading order.
 * Home (the hero) is included so the header always offers a way back to the
 * top of the page. The ids are identical to the registry, so a link can never
 * point at a section that is not mounted.
 */
export const nav = sections

/**
 * About copy. Every clause restates a supplied fact; nothing is inferred about
 * traits, years of experience or outcomes.
 */
export const about = {
  lead:
    'Computer Science graduate building full-stack web applications with React, Node.js, Express and MongoDB.',
  paragraphs: [
    'I build full-stack web apps with React on the front end and Node.js, Express and MongoDB behind them, working across REST APIs, JWT authentication and role-based access control.',
    'Outside coursework and client work I practise problem solving — 80+ DSA problems solved on LeetCode and NeetCode.',
  ],
  /** A short, verifiable line for the hero. */
  highlight: '80+ DSA problems solved',
}

/**
 * Skills, grouped exactly as supplied. Each group renders as its own block, so
 * the grouping is a real structural decision rather than a flat tag cloud.
 */
export const skillGroups = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['Java', 'JavaScript (ES6+)', 'Python', 'HTML5', 'CSS3'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: ['React.js', 'Responsive design', 'REST API integration'],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'RBAC'],
  },
  { id: 'databases', label: 'Databases', items: ['MongoDB', 'MySQL'] },
  {
    id: 'tools',
    label: 'Tools',
    items: ['Git', 'GitHub', 'Postman', 'npm', 'VS Code', 'IntelliJ IDEA'],
  },
  { id: 'libraries', label: 'Libraries', items: ['OpenCV', 'CustomTkinter'] },
]

/**
 * Education history as an array from the outset, so the timeline is extensible
 * with data rather than markup. Dates are the supplied range, not inferred, and
 * `note` restates a verified fact rather than an invented achievement.
 *
 * RENDER ORDER — NEWEST FIRST
 * The timeline renders this array in order, so a newer entry is prepended, not
 * appended. Alternating left/right placement is derived from the index in the
 * component, so order here is also presentation order.
 *
 * SHAPE (one entry is a college entry, a school entry is shown commented):
 *   level       'college' draws the graduation cap node, 'school' the school
 *               building node.
 *   name        The institution.
 *   degree      College entries: the programme. null on school entries.
 *   class       School entries: the class completed. null on college entries.
 *   board       School entries: the board. Optional — null renders nothing.
 *   start/end   Plain strings, so a month range ("September 2022") and a bare
 *               year ("2020") both fit without a date parser. `start` is
 *               optional: an entry carrying only `end` renders that single
 *               year in the footer rather than a broken range.
 *   percentage  Optional badge (school entries in practice). null = no badge.
 *   coursework  Optional chips. null/[] renders no chip row.
 *   note        Optional mono footnote. null renders nothing.
 *
 * Adding a school entry is a data edit only:
 *   {
 *     id: 'school-x',
 *     level: 'school',
 *     name: 'Some School',
 *     degree: null,
 *     class: 'Class XII',
 *     board: 'CBSE',
 *     start: '2020',
 *     end: '2022',
 *     percentage: '85%',
 *     coursework: null,
 *     note: null,
 *   },
 */
export const education = [
  {
    id: 'coer-btech',
    level: 'college',
    name: 'College of Engineering Roorkee',
    shortName: 'COER',
    degree: 'B.Tech in Computer Science and Engineering',
    class: null,
    board: null,
    start: 'September 2022',
    end: 'July 2026',
    percentage: null,
    coursework: ['Data Structures and Algorithms', 'Operating Systems', 'DBMS'],
    note: '80+ DSA problems solved on LeetCode and NeetCode',
  },
  // Older than COER, so it follows it under newest-first order. Only the
  // supplied facts are present: no board, no percentage, no start year, no
  // location — the footer shows the end year alone.
  {
    id: 'jingle-bells-class-xii',
    level: 'school',
    name: 'Jingle Bells Public School',
    class: 'Class XII (Intermediate)',
    end: '2020',
  },
]

/**
 * Certifications and programmes.
 *
 * `kind` separates genuine certifications from Forage's virtual experience
 * programmes, which are simulations rather than credentials for a role held.
 * The distinction is rendered visibly — calling a simulation a job would
 * misrepresent it.
 */
export const certifications = [
  {
    id: 'ibm-generative-ai',
    title: 'Generative AI Fundamentals',
    issuer: 'IBM',
    platform: 'Coursera',
    year: '2024',
    kind: 'certification',
  },
  {
    id: 'jpmorgan-virtual-experience',
    title: 'Software Engineering Virtual Experience',
    issuer: 'JPMorgan Chase',
    platform: 'Forage',
    year: '2024',
    kind: 'virtual-experience',
  },
  {
    id: 'deloitte-job-simulation',
    title: 'Technology Job Simulation',
    issuer: 'Deloitte',
    platform: 'Forage',
    year: '2025',
    kind: 'virtual-experience',
  },
]

/**
 * Verified projects.
 *
 * `image` names the entry in src/assets/projects/images.json. Resolution to a
 * URL and a `srcset` happens in src/lib/images.js, so the dimensions here are
 * never hand-written and can never drift from the files on disk.
 *
 * `liveUrl` is set for LibVerse and InterviewPilot. QR Code Studio has
 * `liveUrl: null`, and every consumer treats a null liveUrl as "render no Live
 * Demo button at all".
 *
 * `gallery` is optional: `{ image, alt, caption, portrait? }` entries rendered
 * as a "Screens" grid in the modal. `portrait` letterboxes a phone screenshot
 * instead of cropping it. Order is presentation order; LibVerse is first.
 *
 * `categoryLabel` is the short form shown on a card; `category` is the longer
 * form shown in the modal. Both describe what the project is, neither asserts
 * anything beyond it.
 *
 * NO PROBLEM / SOLUTION / IMPACT BLOCK
 * The features below are the verified capability list. There is deliberately no
 * framing of the form "the problem was X, so we did Y, which achieved Z" —
 * those claims would have to be invented, and an invented impact number is
 * worse than no impact section at all.
 */
export const projects = [
  {
    id: 'libverse',
    name: 'LibVerse: Smart Library Management System',
    image: 'libverse',
    imageAlt:
      'LibVerse hero image showing the Student, Librarian and Admin portals of the library management system.',
    category: 'Full-stack web app',
    tagline: 'Student, Librarian and Admin portals',
    summary:
      'Full-stack library system with Student, Librarian and Admin portals: borrowing, renewals, reservations with 48-hour holds, fines and waivers, QR scan desk and signed library cards, analytics and reports, and explainable AI book picks. Pick a role and explore, no sign-up needed.',
    repository: 'https://github.com/Vishesh233/LibVerse',
    liveUrl: 'https://lib-verse.vercel.app/demo',
    liveUrlNote: 'No sign-up needed',
    overview:
      'A full-stack library system with Student, Librarian and Admin portals covering borrowing, renewals, reservations with 48-hour holds, fines and waivers, a QR scan desk and signed library cards, analytics and reports, and explainable AI book picks. The live demo lets you pick a role and explore without signing up.',
    features: [
      "Atomic stock updates so two librarians can't over-issue a book",
      'Google sign-in, email OTP login and email verification',
      'Flask + TF-IDF recommendations with automatic fallback',
      '200+ Jest/pytest tests and GitHub Actions CI',
      'Isolated demo database that resets every 6 hours',
    ],
    stack: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'Flask',
      'scikit-learn',
      'JWT',
      'Jest',
      'GitHub Actions',
      'Vercel',
      'Render',
      'MongoDB Atlas',
    ],
    gallery: [
      { image: 'libverse-student', alt: 'LibVerse student dashboard.', caption: 'Student dashboard' },
      { image: 'libverse-librarian', alt: 'LibVerse librarian dashboard.', caption: 'Librarian dashboard' },
      { image: 'libverse-admin', alt: 'LibVerse admin analytics dashboard.', caption: 'Admin analytics' },
      { image: 'libverse-scan', alt: 'LibVerse librarian QR scan desk.', caption: 'QR scan desk' },
      { image: 'libverse-card', alt: 'LibVerse digital library card, front side.', caption: 'Library card' },
      { image: 'libverse-mobile', alt: 'LibVerse student dashboard on a phone.', caption: 'Mobile', portrait: true },
    ],
  },
  {
    id: 'interviewpilot',
    name: 'InterviewPilot',
    image: 'interviewpilot',
    imageAlt:
      'InterviewPilot interface showing a generated interview preparation plan built from a job description.',
    category: 'AI-assisted web app',
    tagline: 'Interview preparation from a job description',
    summary:
      'Turns a job description into a structured preparation plan — personalized questions, coverage maps, schedules, flashcards and practice sessions.',
    repository: 'https://github.com/Vishesh233/InterviewPilot',
    liveUrl: 'https://interview-pilot-ten.vercel.app',
    liveUrlNote: 'Sign-in required',
    overview:
      'InterviewPilot takes a pasted job description and turns it into a structured preparation plan. The generated material is drawn from the posting itself, so what you practise is shaped by what the role actually asked for.',
    features: [
      'Researches the company and the role\'s requirements',
      'Personalized questions generated from a job description',
      'Coverage maps',
      'Schedules',
      'Flashcards',
      'Practice sessions',
    ],
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Gemini API'],
    notes:
      'The feature list above is the project description taken from the repository. The AI integration uses the Gemini API, which is a listed repository topic.',
  },
  {
    id: 'qr-code-studio',
    name: 'QR Code Studio v2',
    image: 'qr-code-studio',
    imageAlt:
      'QR Code Studio v2 desktop interface with QR code generation settings and a live preview panel.',
    category: 'Python desktop app',
    tagline: 'QR code generation and scanning',
    summary:
      'A modular desktop application for generating, customising, exporting and scanning QR codes, with four switchable themes.',
    repository: 'https://github.com/Vishesh233/QR-Code-Studio-v2',
    liveUrl: null,
    overview:
      'QR Code Studio v2 is a desktop application covering QR codes end to end: generating them with a logo embedded and custom colours, previewing the result live, exporting it as an image, and reading codes back with the built-in scanner.',
    features: [
      'QR generation with logo embedding',
      'Colour customisation',
      'Live preview',
      'Image export',
      'Real-time scanner',
      '4 built-in themes with switching at runtime',
      'Modular OOP architecture — 15+ files and 10+ reusable UI components',
    ],
    stack: ['Python', 'OpenCV', 'Pyzbar', 'CustomTkinter'],
  },
]
/**
 * Portrait.
 *
 * The only photograph on the page. `src` is a lazy import so Vite can
 * fingerprint and optimise it; `width`/`height` are the real intrinsic pixel
 * dimensions read off disk (400x400), so the browser reserves the correct box
 * in both the circular hero frame and the rectangular About frame and the page
 * never shifts when it loads.
 *
 * Set `image` to null to fall back to the monogram treatment everywhere — the
 * Portrait component handles that case, so no caller needs its own branch.
 */
export const profile = {
  image: () => import('../assets/profile.jpg'),
  width: 400,
  height: 400,
  alt: 'Portrait of Vishesh Khanna',
  monogram: 'VK',
}

/**
 * The three About cards.
 *
 * Each is a small, labelled statement about how the work is approached. Every
 * clause restates a supplied fact — the frameworks actually used, the DSA
 * count, the named programmes, the named tools. `dot` selects which
 * accent marks the card; the three are distinct so the cards read as a set
 * rather than as three identical blocks.
 */
export const aboutCards = [
  {
    id: 'what-i-build',
    label: 'What I build',
    dot: 'accent',
    body:
      'Full-stack web apps with React on the front end and Node.js, Express and MongoDB behind them — including LibVerse, a role-based library management system, and InterviewPilot, an AI-assisted interview preparation tool.',
  },
  {
    id: 'how-i-practice',
    label: 'How I practice',
    dot: 'secondary',
    body:
      '80+ DSA problems solved on LeetCode and NeetCode, alongside learning programmes from IBM, JPMorgan Chase and Deloitte. The latter two are Forage virtual experience programmes rather than roles.',
  },
  {
    id: 'tools-i-work-with',
    label: 'Tools I work with',
    dot: 'ink',
    body: 'Git, GitHub, Postman, npm, VS Code and IntelliJ IDEA — the version control, API testing and editing toolkit behind the projects above.',
  },
]

/**
 * The About stat tiles.
 *
 * Derived from the registries above rather than typed in by hand, so a tile can
 * never disagree with the data it summarises. If a fourth project or
 * certification is added, these counts follow automatically.
 */
export const stats = [
  { id: 'dsa', value: '80+', label: 'DSA problems solved' },
  { id: 'projects', value: String(projects.length), label: 'Projects built' },
  {
    id: 'certifications',
    value: String(certifications.length),
    label: 'Certifications',
  },
]