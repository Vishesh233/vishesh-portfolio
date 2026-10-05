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
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Primary navigation — an explicit subset of `sections`, in reading order.
 * Declared separately so the header shows a short list while the page keeps its
 * full structure. The ids are identical to the registry, so a link can never
 * point at a section that is not planned.
 */
export const nav = sections.filter((section) => section.id !== 'hero')

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

/** Education. Dates are the supplied range, not inferred. */
export const education = {
  degree: 'B.Tech in Computer Science and Engineering',
  institution: 'College of Engineering Roorkee',
  period: '2022 — 2026',
  startMonth: 'September 2022',
  endMonth: 'July 2026',
  coursework: ['Data Structures and Algorithms', 'Operating Systems', 'DBMS'],
}

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

/** Leadership and volunteering. */
export const leadership = [
  {
    id: 'praharsh',
    role: 'Core Member',
    organisation: 'Praharsh',
    detail: 'College social welfare club',
  },
  {
    id: 'unnat-bharat',
    role: 'Volunteer',
    organisation: 'Unnat Bharat Abhiyan',
    detail: null,
  },
]

/**
 * Verified projects.
 *
 * `liveUrl` is set only for InterviewPilot, from that repository's own
 * homepage field. LibVerse and QR Code Studio have `liveUrl: null`, and every
 * consumer treats a null liveUrl as "render no Live Demo button at all".
 *
 * `image` is a lazy import function so Vite can fingerprint and optimise the
 * file; `width`/`height` are the real intrinsic pixel dimensions read off disk,
 * so the browser reserves the correct box and the page never shifts when the
 * image loads.
 *
 * Stack entries are limited to what is verifiable. For InterviewPilot the
 * package.json files and repository topics confirm the frameworks and the
 * Gemini API integration; nothing beyond that is claimed.
 */
export const projects = [
  {
    id: 'libverse',
    name: 'LibVerse',
    tagline: 'Role-based library management',
    summary:
      'A role-based library management system with separate portals for Students, Librarians and Super Admins.',
    category: 'Full-Stack Application',
    image: () => import('../assets/projects/libverse.png'),
    imageAlt:
      'LibVerse interface showing the library management dashboard with book records and role-based navigation.',
    width: 1919,
    height: 1048,
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    repository: 'https://github.com/Vishesh233/LibVerse',
    liveUrl: null,
    overview:
      'LibVerse is a library management system built around role-based access control. A custom JWT auth middleware guards the API, and each of the three roles — Student, Librarian and Super Admin — gets its own portal with the features that role actually needs.',
    features: [
      'Role-based portals for Student, Librarian and Super Admin (50+ features)',
      'Custom JWT authentication middleware applied across the API',
      'Book CRUD with search and filtering',
      'Wishlists, and issue / return workflows',
      'Image upload handled with Multer and Sharp',
      'Analytics dashboards over 1,000+ simulated records',
      'Reusable components and custom hooks that cut duplicate UI code by 40%',
    ],
    notes:
      'Dashboard data is generated rather than drawn from a live catalogue, and is labelled as simulated throughout the interface.',
  },
  {
    id: 'interviewpilot',
    name: 'InterviewPilot',
    tagline: 'AI-assisted interview preparation',
    summary:
      'Turns a job description into a structured preparation plan, with company and requirements research.',
    category: 'Web Platform',
    image: () => import('../assets/projects/interviewpilot.png'),
    imageAlt:
      'InterviewPilot interface showing a generated interview preparation plan built from a job description.',
    width: 1917,
    height: 887,
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Gemini API'],
    repository: 'https://github.com/Vishesh233/InterviewPilot',
    liveUrl: 'https://interview-pilot-ten.vercel.app',
    /** Shown under the Live Demo button so visitors are not surprised by a gate. */
    liveUrlNote: 'Sign-in required',
    overview:
      'InterviewPilot turns a pasted job description into a structured preparation plan. It researches the company and the requirements in the posting, then uses that research to shape what the practice material covers.',
    features: [
      'Generates a preparation plan from a pasted job description',
      'Researches the company and the requirements in the posting',
      'Shapes practice material around what the research surfaces',
      'Front end and API in separate applications within one repository',
      'Backend test suite and a repeatable evaluation script',
    ],
    notes: 'The AI integration uses the Gemini API, which is a listed repository topic.',
  },
  {
    id: 'qr-code-studio',
    name: 'QR Code Studio v2',
    tagline: 'Desktop QR generation and scanning',
    summary:
      'A modular desktop app for generating, customising, exporting and scanning QR codes.',
    category: 'Desktop Application',
    image: () => import('../assets/projects/qr-code-studio.png'),
    imageAlt:
      'QR Code Studio v2 desktop interface with QR code generation settings and a live preview panel.',
    width: 1919,
    height: 1192,
    stack: ['Python', 'OpenCV', 'Pyzbar', 'CustomTkinter'],
    repository: 'https://github.com/Vishesh233/QR-Code-Studio-v2',
    liveUrl: null,
    overview:
      'QR Code Studio v2 is a desktop application for working with QR codes end to end — generating them with customisation, previewing the result live, exporting it as an image, and reading codes back with the built-in scanner.',
    features: [
      'Modular codebase — 15+ files and 10+ reusable UI components',
      'QR generation with logo embedding and colour customisation',
      'Live preview of the generated code',
      'Image export',
      'Real-time scanning',
      '4 built-in themes with switching at runtime',
    ],
  },
]