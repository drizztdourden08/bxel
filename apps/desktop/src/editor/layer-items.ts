/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { LayerItem } from '../views/LayersPanel/LayersPanel.type';

const layerItems = (sprite: Sprite): LayerItem[] =>
  sprite.layers
    .map((layer) => ({ id: layer.id, label: layer.name, toggles: { visible: layer.visible, locked: layer.locked } }))
    .reverse();

export { layerItems };
