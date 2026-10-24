/* @layer renderer-app @kind constants */
import type { DocumentDialogOptions, DocumentWriteOptions } from '@drizztdourden08/brock-core';
import type { FileActionKind, FileBusy, FileOutcome } from './files.type';

const BXEL_EXTENSION = 'bxel';

const BXEL_SUFFIX = `.${BXEL_EXTENSION}`;

const BXEL_FILTERS: NonNullable<DocumentDialogOptions['filters']> = [{ name: 'Bxel project', extensions: [BXEL_EXTENSION] }];

const PNG_FILTERS: NonNullable<DocumentDialogOptions['filters']> = [{ name: 'PNG image', extensions: ['png'] }];

const EXPORT_WRITE: DocumentWriteOptions = { recent: false };

const CANCELLED: FileOutcome = { kind: 'cancelled' };

const BUSY_OF: Readonly<Record<FileActionKind, FileBusy>> = {
  save: 'saving',
  saveAs: 'saving',
  open: 'opening',
  openPath: 'opening',
  export: 'exporting',
};

const FILE_TEXT = {
  group: 'File',
  saveTitle: 'Save project',
  openTitle: 'Open project',
  exportTitle: 'Export PNG',
  saveReady: 'Save project (.bxel)',
  saveClean: 'Saved. No changes to save.',
  saveBusy: 'Saving',
  exportReady: 'Export images and sheet data',
  exportBusy: 'Exporting',
  saveAsAction: 'Save as',
  busy: 'Wait for the current operation.',
  noDocument:'Open or create a project first.',
  nothingToExport: 'This project has no sprite frame to export.',
  readOnly: 'This project opens read-only.',
  recentLabel: 'Open recent',
  recentNone: 'No recent projects',
  recentClear: 'Clear recent projects',
  recentMissing: 'That project no longer exists. It was removed from the recent list.',
  unavailable: 'File access is not available here.',
  notBxel: 'Bxel opens .bxel project files.',
  unknownReason: 'The cause is unknown',
  unreadable: 'The file is not a Bxel project.',
  saveFailed: (file: string): string => `Could not save ${file}. Your last saved file is unchanged.`,
  openFailed: (file: string, reason: string): string => `Could not open ${file}. ${reason}`,
  exportFailed: (reason: string): string => `Export failed: ${reason}. No files were changed.`,
  exported: (file: string): string => `Exported ${file}.`,
} as const;

const NOTICE_VARIANT = {
  open: 'warning',
  openPath: 'warning',
  save: 'info',
  saveAs: 'info',
  export: 'success',
} as const;

const FILE_COMMAND = {
  open: 'project.open',
  save: 'project.save',
  saveAs: 'project.save_as',
  export: 'export.open',
} as const;

const RECENT_ACTIONS: readonly FileActionKind[] = ['open', 'openPath', 'save', 'saveAs'];

const REASON_PREFIX = /^Error invoking remote method '[^']*': (Error: )?/;

const PATH_SEPARATOR = /[\\/]/;

const ISSUE_LIMIT = 3;

export {
  BUSY_OF,
  BXEL_EXTENSION,
  BXEL_FILTERS,
  BXEL_SUFFIX,
  CANCELLED,
  EXPORT_WRITE,
  FILE_COMMAND,
  FILE_TEXT,
  ISSUE_LIMIT,
  NOTICE_VARIANT,
  PATH_SEPARATOR,
  PNG_FILTERS,
  RECENT_ACTIONS,
  REASON_PREFIX,
};
