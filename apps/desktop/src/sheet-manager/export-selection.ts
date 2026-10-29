/* @layer renderer-app @kind logic */
import { openExport } from '../export/open-export';
import type { ExportKind } from '../export/export.type';

const exportSelection = (kind: Extract<ExportKind, 'sheet' | 'sprite'>): void => {
  openExport(kind, { kind, sprites: 'selected' });
};

export { exportSelection };
