/* @layer renderer-app @kind constants */
import type { ProjectSettings } from './project.type';

const PROJECT_DEFAULTS: ProjectSettings = { projectRecents: [] };

const PROJECT_WIDGET_ID = 'project';

const PROJECT_COMMAND = {
  new: 'project.new',
  open: 'project.open',
  close: 'project.close',
  panel: 'project.panel',
  settings: 'project.settings',
} as const;

const PROJECT_FILE_EXTENSION = 'bxproject';

const PROJECT_FILE_SUFFIX = `.${PROJECT_FILE_EXTENSION}`;

const NEW_FILE_SUFFIX = '.bxsprite';

const PROJECT_GROUP = 'Project';

const PROJECT_TEXT = {
  menu: 'Project',
  newProject: 'New project...',
  openProject: 'Open project...',
  openRecent: 'Open recent project',
  recentNone: 'No recent projects',
  closeProject: 'Close project',
  settings: 'Project settings...',
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
  trashTitle: 'Move to the trash?',
  trashMessage: (name: string, isFolder: boolean): string =>
    isFolder ? `The folder ${name} and everything in it moves to the trash. You can restore it from there.` : `${name} moves to the trash. You can restore it from there.`,
  trashConfirm: 'Move to trash',
  trashed: (name: string): string => `Moved ${name} to the trash.`,
  renamed: (name: string): string => `Renamed to ${name}.`,
  folderCreated: (name: string): string => `Created the folder ${name}.`,
  inProject: (file: string, project: string): string => `${file} in ${project}`,
  nameNoFolder: 'A name has no folder part.',
  nameExists: (name: string): string => `There is already something named ${name} here.`,
  keepExtension: (extension: string): string => `Keep the ending ${extension} so the file stays the same kind.`,
  noFolderHere: 'Open a folder of the project first.',
  removedFromList: (name: string): string => `Removed ${name} from the list. The folder is untouched.`,
  settingsTitle: 'Project settings',
  linkedTitle: 'Linked folders',
  linkedHint: 'A linked folder is another place on this computer that belongs to the project. The first folder is the project folder and stays.',
  addLinked: 'Add a linked folder...',
  removeLinked: (name: string): string => `Remove the linked folder ${name}`,
  rootFolder: 'Project folder',
  linkedPickTitle: 'Choose a folder to link',
  linkedAdded: (name: string): string => `Linked the folder ${name}.`,
  linkedRemoved: (name: string): string => `Unlinked the folder ${name}. Its files stay where they are.`,
  linkedSame: 'That folder is already part of the project.',
  done: 'Done',
  migrated: 'Updated the project file to the new format.',
  newSprite: 'New sprite',
  packed: 'This project file is packed for sharing. Unpack it into a folder first.',
} as const;

const SIZE_UNITS = { step: 1024, wholeFrom: 10, names: ['B', 'KB', 'MB', 'GB'] } as const;

const PANEL_LIST_LIMIT = 1000;

const LINKED_NAME_MAX = 64;

const FOLDER_PART_PATTERN = /[\\/]/;

const PANEL_TEXT = {
  title: 'Project',
  emptyTitle: 'No project open',
  emptyMessage: 'A project keeps several files and folders together, and can let an assistant browse them.',
  recent: 'Recent projects',
  refresh: 'Refresh the list',
  newFile: 'New file in the project',
  newFolder: 'New folder in the project',
  folderNameLabel: 'Folder name',
  folderNamePlaceholder: 'New folder name',
  renameLabel: 'New name',
  rename: 'Rename',
  renameSubmit: 'Save name',
  trash: 'Move to trash',
  entryActions: (name: string): string => `Actions for ${name}`,
  removeRecent: 'Remove from list',
  settingsLabel: 'Project settings',
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

export { ACCESS_LABEL, FOLDER_PART_PATTERN, LINKED_NAME_MAX, NEW_FILE_SUFFIX, PANEL_LIST_LIMIT, PANEL_TEXT, PROJECT_COMMAND, PROJECT_DEFAULTS, PROJECT_FILE_EXTENSION, PROJECT_FILE_SUFFIX, PROJECT_GROUP, PROJECT_TEXT, PROJECT_WIDGET_ID, SIZE_UNITS };
