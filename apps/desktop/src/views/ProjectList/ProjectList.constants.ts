/* @layer renderer-app @kind constants */
import type { DiskState } from '../../project-manager/project-manager.type';

const IDLE_DISK: DiskState = { status: 'idle' };

const PROJECTS_TEXT = {
  listTitle: 'Projects',
  listLabel: 'projects',
  detailLabel: 'project',
  storageKey: 'project.list',
  newProject: 'New project...',
  openProject: 'Open project...',
  listEmpty: 'No projects yet. Make one or open one.',
  openBadge: 'Open',
  removeLabel: (name: string): string => `Remove ${name} from the list`,
  emptyTitle: 'Pick a project',
  emptyMessage: 'Pick a project on the left to look inside it, or start a new one. A project keeps your sprites, sheets and palettes together.',
  noProjectTitle: 'No project is open',
  noProjectMessage: 'Open a project to browse its files here.',
  openIt: 'Open project',
  closeIt: 'Close project',
  reveal: 'Reveal in folder',
  isOpen: 'This project is open. Its files are in the Browse page.',
  toBrowse: 'Browse its files',
  loading: 'Reading the project from the disk...',
  noAccess: 'Bxel can no longer reach this folder. Open the project to give it access again.',
  failedTitle: 'The project could not be read',
  lastOpened: 'Last opened',
  removedFromList: (name: string): string => `Removed ${name} from the list. The folder is untouched.`,
} as const;

export { IDLE_DISK, PROJECTS_TEXT };
