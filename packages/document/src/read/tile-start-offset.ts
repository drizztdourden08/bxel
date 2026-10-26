/* @layer core @kind logic */
import type { TileSeed } from './tile-playback.type';

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

const hashOf = (text: string): number => {
  let hash = FNV_OFFSET;
  for (let at = 0; at < text.length; at += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(at), FNV_PRIME) >>> 0;
  }
  return hash;
};

const tileStartOffset = (seed: TileSeed, cycleMs: number): number =>
  cycleMs <= 0 ? 0 : hashOf(`${seed.map}:${seed.layer}:${seed.cell}`) % cycleMs;

export { tileStartOffset };
