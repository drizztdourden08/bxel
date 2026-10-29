/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import { opaqueOf } from './opaque-of';

const framesOpaque = (target: EditorTarget): MaskView => {
  const { sprite } = target;
  const bits = new Uint8Array(sprite.width * sprite.height);
  for (const celId of Object.values(target.layer.cels)) {
    const pixels = sprite.cels[celId]?.pixels;
    pixels?.forEach((value, at) => {
      if (value !== 0) bits[at] = 1;
    });
  }
  return { ...opaqueOf(bits, sprite.width, sprite.height), bits };
};

export { framesOpaque };
