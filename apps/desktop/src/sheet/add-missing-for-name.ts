/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { addMissingLayers } from './add-missing-layers';

const addMissingForName = (sprites: readonly Sprite[], name: string): void => {
  const key = name.toLowerCase();
  const layerGaps = sprites.filter((sprite) => !sprite.layers.some((layer) => layer.name.toLowerCase() === key)).map((sprite) => sprite.id);
  addMissingLayers({ text: '', layerName: name, layerGaps, keep: [] });
};

export { addMissingForName };
