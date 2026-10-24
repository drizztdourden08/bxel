/* @layer renderer-app @kind constants */
import { ACCESS_LABEL } from '../../project/project.constants';
import type { AccessOption } from './AssistantProjects.type';

const ACCESS_OPTIONS: readonly AccessOption[] = [
  { value: 'off', label: ACCESS_LABEL.off },
  { value: 'read', label: ACCESS_LABEL.read },
  { value: 'edit', label: ACCESS_LABEL.edit },
];

const GRANTS_TEXT = {
  intro: 'Let the assistant browse a project. It can then list the project folders and open files in them. A project that is off stays invisible to it.',
  needsOpen: 'The assistant reaches a project only while you have it open in Bxel.',
  needsAccess: 'Assistant access must be on, on the Assistant page, for any of this to count.',
  empty: 'No projects yet. Create or open a project and it shows here.',
  grantLabel: (name: string): string => `Let the assistant browse ${name}`,
  openBadge: 'Open now',
  folders: 'Folders this grant covers',
} as const;

export { ACCESS_OPTIONS, GRANTS_TEXT };
