/* @layer renderer-app @kind logic */
import type { Tileset } from '@bxel/document';
import { LAYER_COLOURS } from '../TilesetFields.constants';

const colourOf = (canvas: HTMLCanvasElement, name: string): string =>
  canvas.ownerDocument.defaultView?.getComputedStyle(canvas).getPropertyValue(name).trim() ?? '';

const layerColour = (canvas: HTMLCanvasElement, tileset: Tileset, layer: string): string => {
  const at = Math.max(0, (tileset.collisionLayers ?? ['solid']).indexOf(layer));
  return colourOf(canvas, LAYER_COLOURS[at % LAYER_COLOURS.length] ?? LAYER_COLOURS[0] ?? '');
};

export { layerColour };
