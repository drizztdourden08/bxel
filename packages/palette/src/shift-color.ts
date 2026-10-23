/* @layer core @kind logic */
import { channelOf } from './channel-of';
import { packRgb } from './pack-rgb';

const clamp = (value: number): number => Math.min(255, Math.max(0, value));

const shiftColor = (rgb: number, offset: number): number =>
  packRgb(
    clamp(channelOf(rgb, 0) + offset),
    clamp(channelOf(rgb, 1) + offset),
    clamp(channelOf(rgb, 2) + offset),
  );

export { shiftColor };
