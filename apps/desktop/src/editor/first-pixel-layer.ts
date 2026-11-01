/* @layer renderer-app @kind logic */
import { descendantIds, layerKindOf } from '@bxel/document';
import type { Layer, LayerId } from '@bxel/document';

const firstPixelLayer = (layers: readonly Layer[], id: string): LayerId | null => {
  const layer = layers.find((each) => each.id === id);
  if (!layer) return null;
  if (layerKindOf(layer) === 'pixel') return layer.id;
  if (layer.kind !== 'group') return null;
  const inside = descendantIds(layers, layer.id);
  return [...layers].reverse().find((each) => inside.has(each.id) && layerKindOf(each) === 'pixel')?.id ?? null;
};

export { firstPixelLayer };
