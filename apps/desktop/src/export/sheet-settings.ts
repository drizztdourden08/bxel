/* @layer renderer-app @kind logic */
import type { PackSettings } from '@bxel/formats';
import { EXPORT_LIMITS } from './export.constants';
import type { ExportSettings } from './export.type';
import type { SheetDim } from './export-parts.type';

const roomFor = (value: number, settings: ExportSettings): number => value + 2 * settings.extrusion;

const nextPower = (value: number): number => 2 ** Math.ceil(Math.log2(Math.max(value, 1)));

const widestRoom = (dims: readonly SheetDim[], settings: ExportSettings): number =>
  Math.max(...dims.map((dim) => roomFor(dim.width, settings))) + 2 * settings.margin;

const autoWidth = (dims: readonly SheetDim[], settings: ExportSettings): number => {
  const area = dims.reduce(
    (sum, dim) =>
      sum + dim.frames * (roomFor(dim.width, settings) + settings.padding) * (roomFor(dim.height, settings) + settings.padding),
    0,
  );
  const wanted = nextPower(Math.max(widestRoom(dims, settings), Math.ceil(Math.sqrt(area))));
  const ceiling = settings.pageSide > 0 ? settings.pageSide : EXPORT_LIMITS.maxSide;
  return Math.min(ceiling, Math.max(EXPORT_LIMITS.minPackedWidth, wanted));
};

const packedWidth = (dims: readonly SheetDim[], settings: ExportSettings): number =>
  settings.maxWidth > 0 ? Math.max(settings.maxWidth, widestRoom(dims, settings)) : autoWidth(dims, settings);

const sheetSettings = (dims: readonly SheetDim[], settings: ExportSettings): PackSettings => {
  const { padding, extrusion, margin, powerOfTwo, rotate } = settings;
  const common = { margin, extrude: extrusion, powerOfTwo, rotate };
  if (settings.layout === 'packed') {
    return { layout: { kind: 'packed', maxWidth: packedWidth(dims, settings), padding }, ...common };
  }
  return {
    layout: {
      kind: 'grid',
      columns: settings.columns,
      cellWidth: Math.max(...dims.map((dim) => roomFor(dim.width, settings))),
      cellHeight: Math.max(...dims.map((dim) => roomFor(dim.height, settings))),
      spacingX: padding,
      spacingY: padding,
      order: 'rows',
    },
    ...common,
  };
};

export { sheetSettings };
