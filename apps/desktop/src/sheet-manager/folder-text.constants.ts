/* @layer renderer-app @kind constants */
const FOLDER_TEXT = {
  toggle: (path: string, closed: boolean): string => (closed ? `Open folder ${path}` : `Close folder ${path}`),
  select: (path: string): string => `Select the sprites in ${path}`,
  menu: 'Move to folder',
  menuTitle: (count: number): string => (count === 1 ? 'Move sprite to a folder' : `Move ${count} sprites to a folder`),
  field: 'Folder',
  hint: 'Use a name such as hero/walk. A name with a slash is a folder path. Leave it empty to take the sprites out of their folder.',
  root: 'No folder',
  label: (count: number): string => (count === 1 ? 'Move sprite to folder' : `Move ${count} sprites to folder`),
  closeAll: 'Close all folders',
  openAll: 'Open all folders',
  groups: 'Folders',
} as const;

export { FOLDER_TEXT };
