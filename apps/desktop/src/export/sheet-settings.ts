/* @layer renderer-app @kind logic */
import type { PackSettings } from '@bxel/formats';
import { EXPORT_LIMITS } from './export.constants';
import type { ExportSettings, Target } from './export.type';

const roomFor = (value: number, settings: ExportSettings): number => value + 2 * settings.extrusion;

const nextPower = (value: number): number => 2 ** Math.ceil(Math.log2(Math.max(value, 1)));

const packedWidth = (targets: readonly Target[], settings: ExportSettings): number => {
  const widest = Math.max(...targets.map((target) => roomFor(target.sprite.width, settings)));
  const area = targets.reduce(
    (sum, target) =>
      sum +
      target.frames.length *
        (roomFor(target.sprite.width, settings) + settings.padding) *
        (roomFor(target.sprite.height, settings) + settings.padding),
    0,
  );
  const wanted = nextPower(Math.max(widest, Math.ceil(Math.sqrt(area))));
  const ceiling = settings.pageSide > 0 ? settings.pageSide : EXPORT_LIMITS.maxSide;
  return Math.min(ceiling, Math.max(EXPORT_LIMITS.minPackedWidth, wanted));
};

const sheetSettings = (targets: readonly Target[], settings: ExportSettings): PackSettings => {
  const { padding, extrusion } = settings;
  if (settings.layout === 'packed') {
    return { layout: { kind: 'packed', maxWidth: packedWidth(targets, settings), padding }, margin: 0, extrude: extrusion, powerOfTwo: settings.powerOfTwo };
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
    margin: 0,
    extrude: extrusion,
    powerOfTwo: settings.powerOfTwo,
  };
};

export { sheetSettings };
