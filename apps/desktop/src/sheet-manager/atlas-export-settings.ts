/* @layer renderer-app @kind logic */
import type { Sheet } from '@bxel/document';
import { DEFAULT_EXPORT_SETTINGS } from '../export/export.constants';
import type { ExportSettings } from '../export/export.type';
import type { AtlasPack } from './manager.type';

const atlasExportSettings = (sheet: Sheet, atlas: AtlasPack): Partial<ExportSettings> => {
  const { layout } = sheet;
  return {
    kind: 'sheet',
    sprites: 'sheet',
    sheetId: sheet.id,
    frames: 'all',
    layout: layout.kind === 'packed' ? 'packed' : 'grid',
    columns: layout.kind === 'grid' ? layout.columns : DEFAULT_EXPORT_SETTINGS.columns,
    maxWidth: layout.kind === 'packed' ? layout.maxWidth : 0,
    padding: sheet.spacing.x,
    margin: sheet.margin,
    extrusion: atlas.extrude,
    trim: atlas.trim && layout.kind !== 'manual',
    powerOfTwo: atlas.powerOfTwo,
    rotate: atlas.rotate && layout.kind === 'packed',
    pageSide: atlas.pageSide,
  };
};

export { atlasExportSettings };
