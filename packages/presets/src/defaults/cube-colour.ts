/* @layer core @kind logic */
import type { ChannelBits } from '../model/preset.type';
import { expandLevel } from '../snap/expand-level';

const cubeColour = (bits: ChannelBits, position: number): number => {
  const [redBits, greenBits, blueBits] = bits;
  const blue = position % 2 ** blueBits;
  const green = Math.floor(position / 2 ** blueBits) % 2 ** greenBits;
  const red = Math.floor(position / 2 ** (blueBits + greenBits));
  return (
    (expandLevel(red, redBits) << 16) | (expandLevel(green, greenBits) << 8) | expandLevel(blue, blueBits)
  );
};

export { cubeColour };
