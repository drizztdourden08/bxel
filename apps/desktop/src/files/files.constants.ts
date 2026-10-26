/* @layer renderer-app @kind constants */
import type { DocumentDialogOptions, DocumentWriteOptions } from '@drizztdourden08/brock-core';
import type { FileActionKind, FileBusy, FileOutcome } from './files.type';

const BXEL_EXTENSIONS: readonly string[] = ['bxsprite', 'bxsheet', 'bxpalette', 'bxtiles', 'bxmap', 'bxproject', 'bxel'];

const OPEN_FILTERS: NonNullable<DocumentDialogOptions['filters']> = [{ name: 'Bxel files', extensions: [...BXEL_EXTENSIONS] }];

const PNG_FILTERS: NonNullable<DocumentDialogOptions['filters']> = [{ name: 'PNG image', extensions: ['png'] }];

const EXPORT_WRITE: DocumentWriteOptions = { recent: false };

const CANCELLED: FileOutcome = { kind: 'cancelled' };

const BUSY_OF: Readonly<Record<FileActionKind, FileBusy>> = {
  save: 'saving',
  saveAs: 'saving',
  saveAll: 'saving',
  open: 'opening',
  openPath: 'opening',
};

const FILE_TEXT = {
  group: 'File',
  saveTitle: 'Save file',
  openTitle: 'Open file',
  saveReady: 'Save file',
  saveClean: 'Saved. No changes to save.',
  saveBusy: 'Saving',
  exportReady: 'Export images and sheet data',
  exportBusy: 'Exporting',
  saveAsAction: 'Save as',
  busy: 'Wait for the current operation.',
  noDocument:'Open or create a file first.',
  readOnly: 'This file opens read-only.',
  importGroup: 'Import',
  recentLabel: 'Open recent',
  recentNone: 'No recent files',
  recentClear: 'Clear recent files',
  recentMissing: 'That file no longer exists. It was removed from the recent list.',
  unavailable: 'File access is not available here.',
  unknownReason: 'The cause is unknown',
  unreadable: 'The file is not a Bxel file.',
  saveFailed: (file: string): string => `Could not save ${file}. Your last saved file is unchanged.`,
  openFailed: (file: string, reason: string): string => `Could not open ${file}. ${reason}`,
} as const;

const NOTICE_VARIANT = {
  open: 'warning',
  openPath: 'warning',
  save: 'info',
  saveAs: 'info',
  saveAll: 'info',
} as const;

const FILE_COMMAND = {
  open: 'file.open',
  save: 'file.save',
  saveAs: 'file.save_as',
  saveAll: 'file.save_all',
  export: 'export.open',
} as const;

const RECENT_ACTIONS: readonly FileActionKind[] = ['open', 'openPath', 'save', 'saveAs'];

const REASON_PREFIX = /^Error invoking remote method '[^']*': (Error: )?/;

const PATH_SEPARATOR = /[\\/]/;

const ISSUE_LIMIT = 3;

export {
  BUSY_OF,
  BXEL_EXTENSIONS,
  CANCELLED,
  EXPORT_WRITE,
  FILE_COMMAND,
  FILE_TEXT,
  ISSUE_LIMIT,
  NOTICE_VARIANT,
  OPEN_FILTERS,
  PATH_SEPARATOR,
  PNG_FILTERS,
  RECENT_ACTIONS,
  REASON_PREFIX,
};
