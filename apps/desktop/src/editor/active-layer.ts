/* @layer renderer-app @kind logic */
import type { Layer, LayerId, Sprite } from '@bxel/document';

const activeLayer = (sprite: Sprite, wanted: LayerId | null): Layer | undefined =>
  sprite.layers.find((layer) => layer.id === wanted) ?? sprite.layers.at(-1);

export { activeLayer };
