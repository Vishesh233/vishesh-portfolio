import {
  BackendIcon,
  DatabaseIcon,
  FrontendIcon,
  LanguagesIcon,
  LibraryIcon,
  ToolsIcon,
} from './SkillIcons.jsx'

/**
 * Category id -> icon component.
 *
 * Kept as a lookup keyed on the ids in `skillGroups`, rather than as an `icon`
 * field on the data itself, because an icon is presentation and the data file
 * is reserved strictly for verified facts. It also means adding a category is a
 * data edit plus an icon, with no change to the Skills layout.
 *
 * THIS IS ITS OWN MODULE ON PURPOSE
 * A file exporting both components and a plain object defeats React Fast
 * Refresh — editing the map would invalidate every icon in the module and force
 * a full remount in development. Splitting the data from the components keeps
 * both refreshable independently.
 *
 * A category with no entry here renders without an icon rather than breaking:
 * the Skills section guards on `Icon` being defined.
 */
export const skillIcons = {
  languages: LanguagesIcon,
  frontend: FrontendIcon,
  backend: BackendIcon,
  databases: DatabaseIcon,
  tools: ToolsIcon,
  libraries: LibraryIcon,
}