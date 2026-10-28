/* @layer renderer-app @kind constants */
import { join } from 'node:path';
import { E2E_RUN_ID } from './run-id.constants';
import { runMarker } from './run-marker';

const APP_DIR = join(import.meta.dirname, '../../..');

const TEMP_PREFIX = runMarker(E2E_RUN_ID);

const PROJECT_PARENT = '.e2e-projects';

const CANVAS_LABEL = 'Sprite canvas';

const STATUS_LABEL = 'Editor status';

const ZOOM_PATTERN = /Zoom\s+(\d+)%/;

const SWATCH_PATTERN = /^Swatch (\d+), [^,]+, (#[0-9A-F]{6})/;

const CURSOR_PARK = { x: 4, y: 4 } as const;

const GRANT_FOLDERS = ['--answer-folder-grants=grant'] as const;

const POLL_MS = 15000;

const EXPORT_DONE_MS = 60000;

const LAYOUT_SETTLE = { attempts: 40, steady: 4, gapMs: 100 } as const;

const SHORTCUT = {
  newFile: 'Control+n',
  saveAs: 'Control+Shift+s',
  save: 'Control+s',
  saveAll: 'Control+Alt+s',
  open: 'Control+o',
  importImage: 'Control+i',
  exportImages: 'Control+Shift+e',
  undo: 'Control+z',
  redo: 'Control+y',
} as const;

export {
  APP_DIR,
  CANVAS_LABEL,
  CURSOR_PARK,
  EXPORT_DONE_MS,
  GRANT_FOLDERS,
  LAYOUT_SETTLE,
  POLL_MS,
  PROJECT_PARENT,
  SHORTCUT,
  STATUS_LABEL,
  SWATCH_PATTERN,
  TEMP_PREFIX,
  ZOOM_PATTERN,
};
