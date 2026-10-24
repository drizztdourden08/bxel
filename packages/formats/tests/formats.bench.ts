/* @layer tests @kind bench */
import { encodeGif, encodePngIndexed, encodePngRgba, packSheet } from '@bxel/formats';
import type { GifAnimation, PackSettings } from '@bxel/formats';
import { bench, describe } from 'vitest';
import { makeGradient } from './make-gradient';
import { makeIndexedFrames } from './make-indexed-frames';
import { makePackItems } from './make-pack-items';
import { makeRgbaPalette } from './make-rgba-palette';

const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };
const LIGHT = { iterations: 20, time: 0, warmupIterations: 3, warmupTime: 0 };
const PNG_SIDE = 2048;
const GIF_SIZE = { width: 128, height: 128 };
const ENTRIES = 16;

const photo = makeGradient(PNG_SIDE, PNG_SIDE);
const indexed = makeIndexedFrames(1, { width: PNG_SIDE, height: PNG_SIDE }, ENTRIES)[0]?.indices ?? new Uint8Array(0);
const palette = makeRgbaPalette(ENTRIES);

const animation: GifAnimation = {
  ...GIF_SIZE,
  palette,
  transparentIndex: null,
  loops: 0,
  frames: makeIndexedFrames(64, GIF_SIZE, ENTRIES),
};

const items = makePackItems(500, 64);
const packed: PackSettings = { layout: { kind: 'packed', maxWidth: 2048, padding: 1 }, margin: 1, extrude: 0 };
const grid: PackSettings = {
  layout: { kind: 'grid', columns: 25, cellWidth: 64, cellHeight: 64, spacingX: 0, spacingY: 0, order: 'rows' },
  margin: 0,
  extrude: 0,
};

describe('file formats', () => {
  bench('PNG RGBA encode, 2048 by 2048, adaptive filter (target 1500 ms)', () => {
    encodePngRgba(photo);
  }, HEAVY);
  bench('PNG indexed encode, 2048 by 2048, 16 colours (target 800 ms)', () => {
    encodePngIndexed({ indices: indexed, palette, width: PNG_SIDE, height: PNG_SIDE });
  }, HEAVY);
  bench('GIF encode, 64 frames of 128 by 128 (target 300 ms)', () => {
    encodeGif(animation);
  }, HEAVY);
  bench('sheet pack, 500 sprites, shelf (target 20 ms)', () => {
    packSheet(items, packed);
  }, LIGHT);
  bench('sheet pack, 500 sprites, grid (target 5 ms)', () => {
    packSheet(items, grid);
  }, LIGHT);
});
