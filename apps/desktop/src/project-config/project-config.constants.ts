/* @layer renderer-app @kind constants */
const PROJECT_EDIT_DELAY_MS = 450;

const PROJECT_LABEL = 'Change project settings';

const NO_COVER = 'none';

const PROJECT_CONFIG_TEXT = {
  noProjectTitle: 'No project open',
  noProject: 'A project keeps your sprites, sheets and palettes together. Start one or open one to see its settings.',
  newProject: 'New project...',
  openProject: 'Open project...',
  unsavedCover: 'Save the sprite first, so the project can point at its file.',
  noCover: 'No cover',
  coverLabel: 'Cover',
  accessLabel: 'Assistant access to this project',
  noOpenProject: 'No project is open.',
  projectFolder: (name: string): string => `${name} (project folder)`,
  foldersOff: 'Turn on assistant access above to choose the folders it can see.',
  noWorkspace: 'The project files are not loaded yet.',
  newPalette: 'New palette file',
  exportTitle: 'Export the palette',
  paletteDone: 'The palette file is ready.',
  noSet: 'Choose a palette from the library first.',
  badScale: (max: number): string => `The scale is a whole number from 1 to ${max}.`,
  badTemplate: 'A template cannot be too long or hold a slash, a backslash, a colon, a quote, or any of * ? < > |.',
  failed: (reason: string): string => `Could not change the project. ${reason}`,
} as const;

export { NO_COVER, PROJECT_CONFIG_TEXT, PROJECT_EDIT_DELAY_MS, PROJECT_LABEL };
