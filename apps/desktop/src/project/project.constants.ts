/* @layer renderer-app @kind constants */
import type { ProjectSettings } from './project.type';

const PROJECT_DEFAULTS: ProjectSettings = { projectRecents: [] };

const PROJECT_WIDGET_ID = 'project';

const PROJECT_COMMAND = {
  new: 'project.new',
  open: 'project.open',
  close: 'project.close',
  panel: 'project.panel',
} as const;

const PROJECT_GROUP = 'Project';

const PROJECT_TEXT = {
  menu: 'Project',
  newProject: 'New project...',
  openProject: 'Open project...',
  openRecent: 'Open recent project',
  recentNone: 'No recent projects',
  closeProject: 'Close project',
  showPanel: 'Show project panel',
  pickTitle: 'Choose the project folder',
  newTitle: 'New project',
  nameLabel: 'Project name',
  folderLabel: 'Project folder',
  folderNone: 'No folder chosen',
  choose: 'Choose folder',
  create: 'Create project',
  cancel: 'Cancel',
  folderHint: 'Pick an existing folder, or make a new one in the folder window. The project file is written there.',
  unavailable: 'Folder access is not available here.',
  noManifest: 'That folder has no Bxel project. Use New project to start one there.',
  hasManifest: 'That folder already holds a Bxel project. Use Open project to open it.',
  nameTaken: 'Choose a project name and a folder first.',
  wrongFolder: (name: string): string => `Choose the folder ${name} itself.`,
  fileExists: (name: string): string => `The project already has a file named ${name}.`,
  fileCreated: (name: string): string => `Created ${name} in the project.`,
  opened: (name: string): string => `Opened the project ${name}.`,
  created: (name: string): string => `Created the project ${name}.`,
  closed: (name: string): string => `Closed the project ${name}.`,
  failed: (reason: string): string => `Could not use the project. ${reason}`,
  saveFailed: (reason: string): string => `Could not save the project file. ${reason}`,
  turnOnTitle: 'Turn on assistant access here?',
  turnOnMessage: (name: string, level: string): string =>
    `Assistant access was on for the project ${name} (${level}), but only for the place it came from. Turn it on for this copy?`,
  turnOnConfirm: 'Turn it on',
  turnOnCancel: 'Keep it off',
} as const;

const SIZE_UNITS = { step: 1024, wholeFrom: 10, names: ['B', 'KB', 'MB', 'GB'] } as const;

const PANEL_LIST_LIMIT = 1000;

const PANEL_TEXT = {
  title: 'Project',
  emptyTitle: 'No project open',
  emptyMessage: 'A project keeps several files and folders together, and can let an assistant browse them.',
  recent: 'Recent projects',
  refresh: 'Refresh the list',
  newFile: 'New file in the project',
  closeLabel: 'Close the project',
  up: 'Up one folder',
  folderLabel: 'Project folder',
  fileNameLabel: 'File name',
  fileNamePlaceholder: 'New file name',
  create: 'Create',
  cancel: 'Cancel',
  empty: 'Nothing here yet. Create a file to start.',
  notGranted: 'Bxel needs your permission to look in this folder.',
  grant: 'Allow access',
  rootLabel: 'Project root',
  filesLabel: 'Project files',
  assistant: (label: string): string => `Assistant access: ${label}`,
  skipped: (count: number): string => (count === 1 ? '1 item is hidden because its name is not allowed.' : `${count} items are hidden because their names are not allowed.`),
} as const;

const ACCESS_LABEL = {
  off: 'Off',
  read: 'Read only',
  edit: 'Read and edit',
} as const;

export { ACCESS_LABEL, PANEL_LIST_LIMIT, PANEL_TEXT, PROJECT_COMMAND, PROJECT_DEFAULTS, PROJECT_GROUP, PROJECT_TEXT, PROJECT_WIDGET_ID, SIZE_UNITS };
