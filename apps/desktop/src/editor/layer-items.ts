/* @layer renderer-app @kind logic */
import { depthOf, layerKindOf } from '@bxel/document';
import type { Layer } from '@bxel/document';
import type { LayerRowModel, LayerRowTree } from '../views/LayerStack/LayerStack.type';
import type { EditorTarget } from './editor.type';
import type { FrameSpread } from './layer-items.type';
import { lockKindOf } from './layer-lock-kind';
import { LAYER_TEXT } from './layer-text.constants';

const childCounts = (layers: readonly Layer[]): Map<string, number> => {
  const counts = new Map<string, number>();
  layers.forEach((layer) => {
    if (layer.parentId !== undefined) counts.set(layer.parentId, (counts.get(layer.parentId) ?? 0) + 1);
  });
  return counts;
};

const treeOf = (layers: readonly Layer[], layer: Layer, counts: Map<string, number>, missing: ReadonlySet<string>): LayerRowTree => ({
  kind: layerKindOf(layer),
  depth: depthOf(layers, layer),
  parentId: layer.parentId ?? null,
  childCount: counts.get(layer.id) ?? 0,
  viewOpacity: layer.viewOpacity ?? 100,
  clip: layer.clip === true,
  exported: layer.exported !== false,
  missing: layer.reference !== undefined && missing.has(layer.reference.path),
});

const layerItems = (target: EditorTarget, spread: FrameSpread | null, missing: ReadonlySet<string>): LayerRowModel[] => {
  const { sprite, bank, frameId } = target;
  const counts = childCounts(sprite.layers);
  return sprite.layers
    .map((layer) => {
      const have = spread?.have.get(layer.name.toLowerCase()) ?? 0;
      const tree = treeOf(sprite.layers, layer, counts, missing);
      return {
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        mixedVisible: false,
        lock: lockKindOf(layer),
        mixedLock: false,
        colour: layer.colour ?? null,
        note: tree.kind === 'pixel' && spread && have < spread.total ? LAYER_TEXT.inFrames(have, spread.total) : null,
        thumb: tree.kind === 'pixel' ? { kind: 'sprite' as const, sprite, bank, layer, frameId } : null,
        ...tree,
      };
    })
    .reverse();
};

export { layerItems };
