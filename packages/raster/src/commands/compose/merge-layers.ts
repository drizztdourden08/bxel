/* @layer core @kind logic */
import type { IdSource, Layer, LayerId } from '@bxel/document';
import type { LayerBuild } from './compose.type';

const slotFor = (ids: IdSource, layers: LayerBuild[], layer: Layer, used: ReadonlySet<number>): number => {
  const found = layers.findIndex((each, at) => each.name === layer.name && !used.has(at));
  if (found >= 0) return found;
  layers.push({ id: ids.next('lay') as LayerId, name: layer.name, visible: layer.visible, locked: layer.locked, cels: {} });
  return layers.length - 1;
};

const mergeLayers = (ids: IdSource, layers: LayerBuild[], source: readonly Layer[]): number[] => {
  const used = new Set<number>();
  return source.map((layer) => {
    const at = slotFor(ids, layers, layer, used);
    used.add(at);
    return at;
  });
};

export { mergeLayers };
