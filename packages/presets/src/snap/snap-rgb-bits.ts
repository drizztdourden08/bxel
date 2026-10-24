/* @layer core @kind logic */
import type { ChannelBits } from '../model/preset.type';
import { snapChannel } from './snap-channel';

const snapRgbBits = (rgb: number, bits: ChannelBits): number => {
  const red = snapChannel((rgb >> 16) & 255, bits[0]);
  const green = snapChannel((rgb >> 8) & 255, bits[1]);
  const blue = snapChannel(rgb & 255, bits[2]);
  return (red << 16) | (green << 8) | blue;
};

export { snapRgbBits };
