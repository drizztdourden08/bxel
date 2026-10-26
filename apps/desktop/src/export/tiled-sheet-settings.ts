/* @layer renderer-app @kind logic */
import type { ExportSettings } from './export.type';

const tiledSheetSettings = (settings: ExportSettings): ExportSettings =>
  settings.flavour === 'tiled'
    ? { ...settings, layout: 'grid', trim: false, extrusion: 0, rotate: false, mergeFrames: false }
    : settings;

export { tiledSheetSettings };
