/* @layer core @kind helper */
import type { CommandStep, LayerId } from '@bxel/document';
import { FIRST } from './first-frame';
import { brand } from './fixture-to-artwork';
import { MUSHROOM } from './layer-engine';

const patchStep = (layerId: string, pixels: number[]): CommandStep => ({
  name: 'pixels.patch',
  targets: { sprites: [MUSHROOM], layers: { by: 'ids', ids: [brand<LayerId>(layerId)] }, frames: { by: 'ids', ids: [FIRST] } },
  options: { rect: { x: 0, y: 0, width: pixels.length, height: 1 }, pixels: new Uint8Array(pixels) },
});

export { patchStep };
