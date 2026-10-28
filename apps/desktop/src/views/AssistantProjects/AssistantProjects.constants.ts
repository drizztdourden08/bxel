/* @layer renderer-app @kind constants */
import { ACCESS_LABEL } from '../../project/project.constants';
import type { AccessOption } from './AssistantProjects.type';

const ACCESS_OPTIONS: readonly AccessOption[] = [
  { value: 'off', label: ACCESS_LABEL.off },
  { value: 'read', label: ACCESS_LABEL.read },
  { value: 'edit', label: ACCESS_LABEL.edit },
];

const GRANTS_TEXT = {
  title: 'Projects',
  intro: 'Let the assistant browse a project. It can then list the project folders and open files in them. A project that is off stays invisible to it.',
  needsOpen:
    'The assistant reaches a project while it is open in Bxel. After a restart Bxel restores the folders of a project that is on, if it still remembers them. Closing a project takes its folders away until then.',
  foldersTitle: 'Folders the assistant can see in the open project',
  foldersHint: 'Leave every folder on to let it see the whole project.',
  needsAccess: 'Assistant access must be on, on the Assistant page, for any of this to count.',
  empty: 'No projects yet. Create or open a project and it shows here.',
  grantLabel: (name: string): string => `Let the assistant browse ${name}`,
  meta: (open: boolean, folders: readonly string[]): string => `${open ? 'Open now. ' : ''}Folders: ${folders.length === 0 ? 'none' : folders.join(', ')}`,
} as const;

export { ACCESS_OPTIONS, GRANTS_TEXT };
