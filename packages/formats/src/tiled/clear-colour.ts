/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import { BYTE_BITS, BYTE_MASK, COLOUR_PATTERN, RGBA_CHANNELS } from './tiled.constants';

const clearColour = (image: RgbaImage, colour: string | null): RgbaImage => {
  const match = colour === null ? null : COLOUR_PATTERN.exec(colour);
  if (!match?.[1]) return image;
  const value = Number.parseInt(match[1], 16);
  const red = (value >> (2 * BYTE_BITS)) & BYTE_MASK;
  const green = (value >> BYTE_BITS) & BYTE_MASK;
  const blue = value & BYTE_MASK;
  const data = new Uint8ClampedArray(image.data);
  for (let at = 0; at < data.length; at += RGBA_CHANNELS) {
    if (data[at] === red && data[at + 1] === green && data[at + 2] === blue) data[at + 3] = 0;
  }
  return { data, width: image.width, height: image.height };
};

export { clearColour };
