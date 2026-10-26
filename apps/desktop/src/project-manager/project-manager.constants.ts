/* @layer renderer-app @kind constants */
import type { ConfigPage } from './project-manager.type';

const CONFIG_PAGES: readonly ConfigPage[] = [
  { page: 'general', label: 'General', description: 'Name, cover and packing the project into one file.', icon: 'folder' },
  { page: 'folders', label: 'Folders', description: 'The folders of the project and the role of each one.', icon: 'folder-open' },
  { page: 'defaults', label: 'Defaults', description: 'Size, colours and platform for new assets.', icon: 'sliders-horizontal' },
  { page: 'palettes', label: 'Palettes', description: 'The palette files shared by the sprites.', icon: 'palette' },
  { page: 'assistant', label: 'Assistant', description: 'Whether an assistant may browse or edit the project.', icon: 'plug-zap' },
  { page: 'export', label: 'Export', description: 'The default scale and file name template.', icon: 'upload' },
];

const MAX_DISK_PREVIEWS = 60;

const PNG_MIME = 'image/png';

const NOTHING_LOADED: ReadonlySet<string> = new Set();

const PREVIEW_ENTRY_KINDS = ['sprite', 'animation'] as const;

const MANAGER_TEXT = {
  listTitle: 'Projects',
  listLabel: 'projects',
  detailLabel: 'project',
  storageKey: 'project.manager.list',
  newProject: 'New project...',
  openProject: 'Open project...',
  listEmpty: 'No projects yet. Make one or open one.',
  openBadge: 'Open',
  removeFromList: 'Remove from list',
  removeLabel: (name: string): string => `Remove ${name} from the list`,
  emptyTitle: 'No project open',
  emptyMessage: 'Pick a project on the left, or start one. A project keeps your sprites, sheets and palettes together.',
  openIt: 'Open project',
  openToEdit: 'Open the project to edit it',
  closeIt: 'Close project',
  rename: 'Rename',
  renameLabel: 'Project name',
  renameSubmit: 'Save name',
  cancel: 'Cancel',
  reveal: 'Reveal in folder',
  readOnlyNote: 'This project is not open. Its files are listed from the disk. Open it to change anything.',
  loading: 'Reading the project from the disk...',
  noAccess: 'Bxel can no longer reach this folder. Open the project to give it access again.',
  noManifest: 'That folder has no Bxel project any more.',
  older: 'This project is in an older format. Open it once to update it.',
  failedTitle: 'The project could not be read',
  factsTitle: 'About this project',
  location: 'Location',
  projectFile: 'Project file',
  assistantAccess: 'Assistant access',
  folderCount: 'Folders',
  folderSummary: (count: number): string => (count === 1 ? '1 folder' : `${count} folders`),
  defaultSize: 'New sprite size',
  defaultColours: 'Colour limit',
  appDefault: 'App default',
  sizeValue: (width: number, height: number): string => `${width} by ${height} pixels`,
  configTitle: 'Configuration',
  configOpenOnly: 'The settings pages change the open project. Open this one first.',
  configLabel: (page: string): string => `Open the ${page} settings`,
  assetsTitle: 'Assets',
  assetsListLabel: 'Assets of the project',
  newAsset: 'New asset',
  searchLabel: 'Search the assets of the project',
  searchPlaceholder: 'Search',
  choiceLabel: (name: string): string => `What to do with ${name}`,
  choiceKind: (kind: string, folder: string): string => `${kind} in ${folder}`,
  inAssetSettings: 'Open in Asset settings',
  inAssetSettingsHint: 'Show the overview and the settings of this asset.',
  toEdit: 'Open to edit',
  toEditHint: 'Open this asset in an editor tab.',
  clearChoice: 'Clear the choice',
  removedFromList: (name: string): string => `Removed ${name} from the list. The folder is untouched.`,
  renameFailed: 'The name could not be changed.',
  nameEmpty: 'Type a name.',
} as const;

export { CONFIG_PAGES, MANAGER_TEXT, MAX_DISK_PREVIEWS, NOTHING_LOADED, PNG_MIME, PREVIEW_ENTRY_KINDS };
