/* @layer renderer-app @kind constants */
import type { FolderRole } from '@bxel/project';

const ROLE_FOLDER_LABEL: Readonly<Record<FolderRole, string>> = {
  sprites: 'Sprites',
  animations: 'Animations',
  sheets: 'Sheets',
  palettes: 'Palettes',
  tilemaps: 'Tilemaps',
  exports: 'Exports',
};

const ROLE_FOLDER_TEXT = {
  menu: 'Set as role folder for...',
  outside: 'This folder is not inside a folder of the project.',
  noProject: 'No project is open.',
  done: (folder: string, role: string): string => `${folder} is now the ${role.toLowerCase()} folder.`,
} as const;

export { ROLE_FOLDER_LABEL, ROLE_FOLDER_TEXT };
