/* @layer renderer-app @kind logic */
import type { PackSettings } from '@bxel/formats';
import { EXPORT_LIMITS } from './export.constants';
import type { ExportSettings, Target } from './export.type';

const roomFor = (value: number, settings: ExportSettings): number => value + 2 * settings.extrusion;

const nextPower = (value: number): number => 2 ** Math.ceil(Math.log2(Math.max(value, 1)));

const widestRoom = (targets: readonly Target[], settings: ExportSettings): number =>
  Math.max(...targets.map((target) => roomFor(target.sprite.width, settings))) + 2 * settings.margin;

const autoWidth = (targets: readonly Target[], settings: ExportSettings): number => {
  const area = targets.reduce(
    (sum, target) =>
      sum +
      target.frames.length *
        (roomFor(target.sprite.width, settings) + settings.padding) *
        (roomFor(target.sprite.height, settings) + settings.padding),
    0,
  );
  const wanted = nextPower(Math.max(widestRoom(targets, settings), Math.ceil(Math.sqrt(area))));
  const ceiling = settings.pageSide > 0 ? settings.pageSide : EXPORT_LIMITS.maxSide;
  return Math.min(ceiling, Math.max(EXPORT_LIMITS.minPackedWidth, wanted));
};

const packedWidth = (targets: readonly Target[], settings: ExportSettings): number =>
  settings.maxWidth > 0 ? Math.max(settings.maxWidth, widestRoom(targets, settings)) : autoWidth(targets, settings);

const sheetSettings = (targets: readonly Target[], settings: ExportSettings): PackSettings => {
  const { padding, extrusion, margin, powerOfTwo, rotate } = settings;
  const common = { margin, extrude: extrusion, powerOfTwo, rotate };
  if (settings.layout === 'packed') {
    return { layout: { kind: 'packed', maxWidth: packedWidth(targets, settings), padding }, ...common };
  }
  return {
    layout: {
      kind: 'grid',
      columns: settings.columns,
      cellWidth: Math.max(...targets.map((target) => roomFor(target.sprite.width, settings))),
      cellHeight: Math.max(...targets.map((target) => roomFor(target.sprite.height, settings))),
      spacingX: padding,
      spacingY: padding,
      order: 'rows',
    },
    ...common,
  };
};

export { sheetSettings };
