/* @layer renderer-app @kind logic */
import type { LayerSelector, SpriteId, TargetScope } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import type { LayerScope } from '../stores/sprite-store.type';

const layerSelector = (scope: LayerScope, target: EditorTarget): LayerSelector => {
  if (scope === 'all') return { by: 'all' };
  const layers = scope === 'active' ? [target.layer] : target.sprite.layers.filter((layer) => layer.visible);
  return { by: 'names', names: layers.map((layer) => layer.name) };
};

const groupScope = (target: EditorTarget, sprites: readonly SpriteId[], layers: LayerScope): TargetScope => ({
  sprites: [...sprites],
  layers: layerSelector(layers, target),
  frames: { by: 'all' },
});

export { groupScope };
