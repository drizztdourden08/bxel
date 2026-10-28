/* @layer renderer-app @kind constants */
const FILE_OPS_TEXT = {
  undo: 'Undo',
  moveTitle: 'Update links?',
  moveMessage: (moved: number, others: number): string =>
    `Moving ${moved} ${moved === 1 ? 'file' : 'files'} updates links in ${others} other ${others === 1 ? 'file' : 'files'}.`,
  moveConfirm: 'Move',
  cancel: 'Cancel',
  moved: (count: number): string => `Moved ${count} ${count === 1 ? 'file' : 'files'}.`,
  movedLinks: (count: number, links: number): string => `Moved ${count} ${count === 1 ? 'file' : 'files'} and kept ${links} ${links === 1 ? 'link' : 'links'}.`,
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
} as const;

export { FILE_OPS_TEXT };
