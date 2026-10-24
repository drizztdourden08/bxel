/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { ReorderItem } from '@drizztdourden08/tessera';

const layerItems = (sprite: Sprite): ReorderItem[] =>
  sprite.layers
    .map((layer) => ({ id: layer.id, label: layer.name, toggles: { visible: layer.visible, locked: layer.locked } }))
    .reverse();

export { layerItems };
