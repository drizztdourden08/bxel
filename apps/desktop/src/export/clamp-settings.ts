/* @layer renderer-app @kind logic */
import { EXPORT_RANGES } from './export.constants';
import type { ExportSettings } from './export.type';

const within = (value: number, range: { readonly min: number; readonly max: number }): number =>
  Number.isFinite(value) ? Math.min(range.max, Math.max(range.min, Math.trunc(value))) : range.min;

const clampSettings = (settings: ExportSettings): ExportSettings => ({
  ...settings,
  scale: within(settings.scale, EXPORT_RANGES.scale),
  columns: within(settings.columns, EXPORT_RANGES.columns),
  padding: within(settings.padding, EXPORT_RANGES.padding),
  extrusion: within(settings.extrusion, EXPORT_RANGES.extrusion),
  pageSide: within(settings.pageSide, EXPORT_RANGES.pageSide),
});

export { clampSettings };
