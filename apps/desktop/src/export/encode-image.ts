/* @layer renderer-app @kind logic */
import { encodePngIndexed, encodePngRgba } from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
import { colourKey } from './colour-key';
import { EXPORT_TEXT } from './export.constants';
import type { ColourMap, MadeFile } from './export.type';
import { madeBytes } from './made-bytes';

const indicesOf = (image: RgbaImage, map: ColourMap): Uint8Array | null => {
  const indices = new Uint8Array(image.width * image.height);
  for (let position = 0; position < indices.length; position += 1) {
    const index = map.lookup.get(colourKey(image.data, position * 4));
    if (index === undefined) return null;
    indices[position] = index;
  }
  return indices;
};

const encodeImage = (image: RgbaImage, map: ColourMap | null): MadeFile => {
  if (map === null) return madeBytes(encodePngRgba(image));
  const indices = indicesOf(image, map);
  if (indices === null) return { ok: false, message: EXPORT_TEXT.unknownReason };
  const encoded = encodePngIndexed({ indices, palette: map.palette, width: image.width, height: image.height });
  return madeBytes(encoded);
};

export { encodeImage };
