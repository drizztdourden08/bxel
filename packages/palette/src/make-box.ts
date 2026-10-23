/* @layer core @kind logic */
import type { ColorEntry } from './census.type';
import { channelOf } from './channel-of';
import type { ColorBox } from './extract.type';

const makeBox = (entries: readonly ColorEntry[]): ColorBox => {
  const low = [255, 255, 255];
  const high = [0, 0, 0];
  let population = 0;
  for (const { rgb, count } of entries) {
    population += count;
    for (let channel = 0; channel < 3; channel += 1) {
      const value = channelOf(rgb, channel);
      low[channel] = Math.min(low[channel] ?? 255, value);
      high[channel] = Math.max(high[channel] ?? 0, value);
    }
  }
  const range = (channel: number): number => (high[channel] ?? 0) - (low[channel] ?? 0);
  let widest = 1;
  if (range(0) > range(widest)) widest = 0;
  if (range(2) > range(widest)) widest = 2;
  return { entries, population, channel: widest, span: range(widest) };
};

export { makeBox };
