/* @layer renderer-app @kind logic */
import { layerKindOf, shownInTree } from '@bxel/document';
import type { LayerSelector, SpriteId, TargetScope } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import type { LayerScope } from '../stores/sprite-store.type';

const layerSelector = (scope: LayerScope, target: EditorTarget): LayerSelector => {
  if (scope === 'all') return { by: 'all' };
  const all = target.sprite.layers;
  const layers = scope === 'active' ? [target.layer] : all.filter((layer) => layerKindOf(layer) === 'pixel' && shownInTree(all, layer));
  return { by: 'names', names: layers.map((layer) => layer.name) };
};

const groupScope = (target: EditorTarget, sprites: readonly SpriteId[], layers: LayerScope): TargetScope => ({
  sprites: [...sprites],
  layers: layerSelector(layers, target),
  frames: { by: 'all' },
});

export { groupScope };
