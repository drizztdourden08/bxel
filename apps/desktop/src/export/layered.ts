/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { LayerChoice } from './export.type';

const layered = (sprite: Sprite, choice: LayerChoice): Sprite =>
  choice === 'visible'
    ? sprite
    : { ...sprite, layers: sprite.layers.map((layer) => (layer.visible ? layer : { ...layer, visible: true })) };

export { layered };
