/* @layer core @kind logic */
import { blendOver } from '../pixels/blend-over';
import type { PixelBytes, RgbaImage } from '../png.type';

const compositeIndexed = (
  layers: readonly Uint8Array[],
  palette: PixelBytes,
  size: { readonly width: number; readonly height: number },
): RgbaImage => {
  const data = new Uint8ClampedArray(size.width * size.height * 4);
  for (const layer of layers) {
    for (let i = 0; i < layer.length; i += 1) blendOver(data, i * 4, palette, (layer[i] ?? 0) * 4);
  }
  return { data, width: size.width, height: size.height };
};

export { compositeIndexed };
