/* @layer renderer-app @kind logic */
import { ancestorsOf, descendantIds } from '@bxel/document';
import type { Sprite } from '@bxel/document';

const layersOnly = (sprite: Sprite, ids: readonly string[]): Sprite | null => {
  const named = sprite.layers.filter((layer) => ids.includes(layer.id));
  if (named.length !== new Set(ids).size) return null;
  const shown = new Set<string>();
  named.forEach((layer) => {
    shown.add(layer.id);
    descendantIds(sprite.layers, layer.id).forEach((id) => shown.add(id));
    ancestorsOf(sprite.layers, layer).forEach((parent) => shown.add(parent.id));
  });
  return { ...sprite, layers: sprite.layers.map((layer) => ({ ...layer, visible: shown.has(layer.id) })) };
};

export { layersOnly };
