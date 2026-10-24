/* @layer renderer-app @kind constants */
const PALETTES_TEXT = {
  list: 'Palette files of the project',
  none: 'The project has no palette file yet.',
  open: 'Open',
  export: 'Export...',
  create: 'New palette file',
  importFile: 'Import a GPL, PAL or HEX file...',
  library: 'Palette from the app library',
  fromLibrary: 'Add as palette file',
  users: (count: number): string => (count === 1 ? 'used by 1 sprite' : `used by ${count} sprites`),
} as const;

const DEFAULT_PREFIX = 'project.default.';

const PROJECT_CONTROL_FIELDS: readonly string[] = [
  'project.cover',
  'project.folders',
  'project.palettes',
  'project.access',
  'project.assistantFolders',
  'project.default.size',
  'project.default.colorLimit',
  'project.default.palette',
  'project.default.platformId',
  'project.default.platformStrict',
  'project.default.transparent',
  'project.default.frameDurationMs',
  'project.default.pixelGrid',
];

export { DEFAULT_PREFIX, PALETTES_TEXT, PROJECT_CONTROL_FIELDS };
