/* @layer tests @kind bench */
import { flattenFrame, frameToRgba } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { bench, describe } from 'vitest';
import { benchArtwork } from './bench-artwork';

const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };
const clock = (): number => Date.UTC(2026, 9, 23, 12, 0, 0);

const layered = benchArtwork([{ index: 1, side: 512, layers: 8, frames: 1 }]);
const layeredSprite = layered.artwork.sprites[0];
const layeredBank = layered.artwork.banks[0];
const firstFrame = layeredSprite?.frames[0]?.id;
if (!layeredSprite || !layeredBank || !firstFrame) throw new Error('the layered fixture is incomplete');

const library = benchArtwork(Array.from({ length: 200 }, (_, at) => ({ index: at + 1, side: 64, layers: 1, frames: 4 })));
const container = encodeArtwork(library, null, clock);

describe('document reads, 512 sprite with 8 layers', () => {
  bench('flattenFrame (target 10 ms)', () => {
    flattenFrame(layeredSprite, firstFrame);
  }, HEAVY);
  bench('frameToRgba (target 16 ms)', () => {
    frameToRgba(layeredSprite, layeredBank, firstFrame);
  }, HEAVY);
});

describe('.bxel container, 200 sprites of 64 by 64 with 4 frames', () => {
  bench('encode (target 400 ms)', () => {
    encodeArtwork(library, null, clock);
  }, HEAVY);
  bench('decode (target 400 ms)', () => {
    decodeArtwork(container);
  }, HEAVY);
});
