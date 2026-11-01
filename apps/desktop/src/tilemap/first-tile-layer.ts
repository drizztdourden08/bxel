/* @layer renderer-app @kind logic */
import { descendantIds } from '@bxel/document';
import type { MapLayer, MapLayerId } from '@bxel/document';

const firstTileLayer = (layers: readonly MapLayer[], id: string): MapLayerId | null => {
  const layer = layers.find((each) => each.id === id);
  if (!layer) return null;
  if (layer.kind !== 'group') return layer.id;
  const inside = descendantIds(layers, layer.id);
  return [...layers].reverse().find((each) => inside.has(each.id) && each.kind !== 'group')?.id ?? null;
};

export { firstTileLayer };
