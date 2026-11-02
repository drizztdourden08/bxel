/* @layer renderer-app @kind constants */
import type { SubjectState } from './properties-subject.type';

const NO_SUBJECT: SubjectState = { status: 'none' };

const HISTORY_LIMIT = 30;

const SUBJECT_PARAM = { subject: 'subject', pin: 'pin' } as const;

const PIN_ON = '1';

const KEY_PREFIX = 'key:';

const SUBJECT_TEXT = {
  follows: 'Follows the selected tab',
  pinnedTo: 'Pinned to this file',
  pin: 'Pin Properties to this file',
  unpin: 'Unpin, follow the selected tab',
  back: 'Previous file',
  forward: 'Next file',
  open: 'Open',
  save: 'Save',
  saved: (name: string): string => `Saved ${name}.`,
  unsaved: 'Unsaved',
  readOnly: 'Read only',
  missing: 'Missing',
  notInProject: 'Not in the project',
  showInProject: 'Show in the Project window',
  unsavedPath: 'Not saved yet',
  missingTitle: 'This file is gone',
  missingMessage: 'The file this window was pinned to is not in the project any more.',
  emptyTitle: 'No file to show',
  emptyMessage: 'Open a file, or pick one in the Project window, and its properties show here.',
  toProject: 'Project window',
  summaryTitle: 'Summary',
  summarySize: 'Size on disk',
  summaryModified: 'Modified',
  summaryPixels: 'Image size',
  summaryFrames: 'Frames',
  summaryNative: 'Not a Bxel file. Import it to work on it here.',
  pixels: (width: number, height: number): string => `${width} by ${height} pixels`,
  importSprite: 'Import as sprite',
  importTileset: 'Import as tileset',
  unreadable: 'This image could not be read.',
  newAsset: 'New asset...',
  openAsset: 'Open...',
} as const;

export { HISTORY_LIMIT, KEY_PREFIX, NO_SUBJECT, PIN_ON, SUBJECT_PARAM, SUBJECT_TEXT };
