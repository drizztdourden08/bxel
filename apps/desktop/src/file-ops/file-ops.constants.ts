/* @layer renderer-app @kind constants */
const JOURNAL_LIMIT = 50;

const DROP_PALETTE_EXTENSIONS: readonly string[] = ['.gpl', '.pal', '.hex'];

const FILE_OPS_TEXT = {
  undo: 'Undo',
  undone: (label: string): string => `Undid the ${label}.`,
  nothingToUndo: 'There is no file move to undo.',
  moveLabel: (count: number): string => `move of ${count} ${count === 1 ? 'file' : 'files'}`,
  renameLabel: (name: string): string => `rename of ${name}`,
  moveTitle: 'Update links?',
  moveMessage: (moved: number, others: number): string =>
    `Moving ${moved} ${moved === 1 ? 'file' : 'files'} updates links in ${others} other ${others === 1 ? 'file' : 'files'}.`,
  moveConfirm: 'Move',
  cancel: 'Cancel',
  moved: (count: number): string => `Moved ${count} ${count === 1 ? 'file' : 'files'}.`,
  movedLinks: (count: number, links: number): string => `Moved ${count} ${count === 1 ? 'file' : 'files'} and kept ${links} ${links === 1 ? 'link' : 'links'}.`,
  held: (count: number, cut: boolean): string => `${cut ? 'Cut' : 'Copied'} ${count} ${count === 1 ? 'file' : 'files'} to the file clipboard.`,
  nothingHeld: 'Cut or copy files first.',
  dropped: (count: number): string => `Added ${count} ${count === 1 ? 'file' : 'files'} to the project.`,
  dropFailed: (names: readonly string[]): string => `Could not add ${names.join(', ')}.`,
  copied: (count: number): string => `Copied ${count} ${count === 1 ? 'file' : 'files'}.`,
  missing: (name: string): string => `${name} is no longer there.`,
  nothingToCopy: 'There is nothing to copy.',
  intoItself: 'A folder cannot move into itself.',
  nothingToMove: 'Those files are already in that folder.',
  renamed: (name: string): string => `Renamed to ${name}.`,
  unreachable: (name: string): string => `Cannot move into ${name}. It cannot be read.`,
  unavailable: 'Folder access is not available here.',
  trashTitle: 'Move to the trash?',
  trashMessage: (count: number, name: string): string => (count === 1 ? `${name} goes to the trash.` : `${count} files go to the trash.`),
  trashReferrers: (count: number): string => `Used by ${count} ${count === 1 ? 'file' : 'files'}. They will show a missing link.`,
  trashConfirm: 'Move to trash',
  trashed: (count: number, name: string): string => (count === 1 ? `Moved ${name} to the trash.` : `Moved ${count} files to the trash.`),
  folderExists: (name: string): string => `A folder named ${name} is already there.`,
  newFolder: 'New folder',
  trashLabel: 'Move to the trash',
  locateTitle: 'Locate the missing file',
  located: (name: string): string => `Linked to ${name}.`,
  locatedLinks: (name: string, links: number): string => `Linked to ${name} and updated ${links} ${links === 1 ? 'link' : 'links'}.`,
  locateWrongKind: (extension: string): string => `Pick a ${extension} file.`,
  locateUnavailable: 'File access is not available here.',
} as const;

export { DROP_PALETTE_EXTENSIONS, FILE_OPS_TEXT, JOURNAL_LIMIT };
