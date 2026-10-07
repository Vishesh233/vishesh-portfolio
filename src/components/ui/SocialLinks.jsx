import { site } from '../../data/site.js'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons.jsx'

/**
 * The three social links, as icons.
 *
 * EVERY LINK IS REAL
 * The list is built from `site`, and a channel with no URL is omitted entirely
 * rather than rendered as a dead icon — so this row can never show a control
 * that goes nowhere. GitHub and LinkedIn open in a new tab with
 * `rel="noopener noreferrer"`; email opens the visitor's own mail client via
 * mailto: and deliberately does NOT open a new tab, because handing a composed
 * message to a fresh tab is disorienting.
 *
 * ACCESSIBLE NAMES
 * Each link carries a visible-to-screen-reader label naming both the action
 * and the destination ("GitHub profile of Vishesh Khanna"). The icons are
 * `aria-hidden`, so a link is never announced as an unlabelled graphic.
 */
export function SocialLinks({ className = '' }) {
  const links = [
    {
      id: 'github',
      href: site.github,
      external: true,
      label: `GitHub profile of ${site.name}`,
      Icon: GithubIcon,
    },
    {
      id: 'linkedin',
      href: site.linkedin,
      external: true,
      label: `LinkedIn profile of ${site.name}`,
      Icon: LinkedinIcon,
    },
    {
      id: 'email',
      href: `mailto:${site.email}`,
      external: false,
      label: `Email ${site.name} at ${site.email}`,
      Icon: MailIcon,
    },
  ].filter((link) => Boolean(link.href))

  return (
    <ul
      className={['flex items-center gap-2', className].filter(Boolean).join(' ')}
    >
      {links.map(({ id, href, external, label, Icon }) => (
        <li key={id}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={[
              'pop-strong grid size-9 place-items-center rounded-sm border border-border',
              'text-muted-strong transition-colors duration-200',
              'hover:text-accent-ink',
            ].join(' ')}
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  )
}