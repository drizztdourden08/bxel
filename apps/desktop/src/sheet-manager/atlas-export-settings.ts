/* @layer renderer-app @kind logic */
import type { Sheet } from '@bxel/document';
import { DEFAULT_EXPORT_SETTINGS } from '../export/export.constants';
import type { ExportSettings } from '../export/export.type';
import type { AtlasSettings } from './manager.type';

const atlasExportSettings = (sheet: Sheet, atlas: AtlasSettings): Partial<ExportSettings> => ({
  sprites: 'sheet',
  sheetId: sheet.id,
  frames: 'all',
  layout: sheet.layout.kind === 'packed' ? 'packed' : 'grid',
  columns: sheet.layout.kind === 'grid' ? sheet.layout.columns : DEFAULT_EXPORT_SETTINGS.columns,
  padding: sheet.spacing.x,
  extrusion: atlas.extrude,
  trim: atlas.trim && sheet.layout.kind !== 'manual',
  powerOfTwo: atlas.powerOfTwo,
  pageSide: atlas.pageSide,
});

export { atlasExportSettings };
