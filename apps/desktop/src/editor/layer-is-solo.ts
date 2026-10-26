/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const layerIsSolo = (sprite: Sprite, layerId: string): boolean =>
  sprite.layers.length > 1 && sprite.layers.every((layer) => layer.visible === (layer.id === layerId));

export { layerIsSolo };
