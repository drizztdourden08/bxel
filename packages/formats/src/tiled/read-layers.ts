/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { boolOf } from './bool-of';
import { decodeGids } from './decode-gids';
import { listOf } from './list-of';
import { numberOf } from './number-of';
import { recOf } from './rec-of';
import type { Rec } from './rec.type';
import { textOf } from './text-of';
import { TILED_LIMITS } from './tiled.constants';
import type { Collected, LayerSpace } from './read-layers.type';
import type { TiledLayer } from './tiled.type';

const tileLayer = (record: Rec, space: LayerSpace): TiledLayer | FormatFailure => {
  const gids = decodeGids(record, space.count);
  if (!(gids instanceof Uint32Array)) return gids;
  const { inherited } = space;
  return {
    name: inherited.path + textOf(record['name'], 'Layer'),
    visible: inherited.visible && boolOf(record['visible'], true),
    locked: boolOf(record['locked'], false),
    opacity: inherited.opacity * numberOf(record['opacity'], 1),
    offsetX: numberOf(record['offsetx'], 0),
    offsetY: numberOf(record['offsety'], 0),
    gids,
  };
};

const collect = (list: readonly unknown[], space: LayerSpace, found: Collected): FormatFailure | null => {
  const { inherited } = space;
  if (inherited.depth > TILED_LIMITS.MAX_LAYER_DEPTH) return formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, 'The layer groups are nested too deeply.');
  for (const entry of list) {
    const record = recOf(entry);
    const type = textOf(record['type'], '');
    if (type === 'tilelayer') {
      const layer = tileLayer(record, space);
      if ('ok' in layer) return layer;
      found.layers.push(layer);
    } else if (type === 'group') {
      const next = {
        path: `${inherited.path}${textOf(record['name'], 'Group')}/`,
        visible: inherited.visible && boolOf(record['visible'], true),
        opacity: inherited.opacity * numberOf(record['opacity'], 1),
        depth: inherited.depth + 1,
      };
      const failed = collect(listOf(record['layers']), { count: space.count, inherited: next }, found);
      if (failed) return failed;
    } else found.skipped += 1;
  }
  return null;
};

const readLayers = (list: unknown, count: number): { layers: TiledLayer[]; skipped: number } | FormatFailure => {
  const found: Collected = { layers: [], skipped: 0 };
  const failed = collect(listOf(list), { count, inherited: { path: '', visible: true, opacity: 1, depth: 0 } }, found);
  if (failed) return failed;
  return found.layers.length > TILED_LIMITS.MAX_LAYERS
    ? formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, 'The map has too many layers.')
    : found;
};

export { readLayers };
