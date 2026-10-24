/* @layer core @kind constants */
const PROJECT_DOCUMENT_VERSION = 2;

const FOLDER_ROLES = ['sprites', 'sheets', 'palettes', 'tilemaps', 'exports'] as const;

const DEFAULT_ROLE_PATHS = {
  sprites: 'sprites',
  sheets: 'sheets',
  palettes: 'palettes',
  tilemaps: 'tilemaps',
  exports: 'exports',
} as const satisfies Record<(typeof FOLDER_ROLES)[number], string>;

export { DEFAULT_ROLE_PATHS, FOLDER_ROLES, PROJECT_DOCUMENT_VERSION };
