/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { takeDirty } from '../../src/canvas-dirty/take-dirty';
import { trackPixels } from '../../src/canvas-dirty/track-pixels';
import { CHANNELS } from '../../src/editor/bank-table.constants';
import type { Overlay } from '../../src/editor/editor.type';
import { refreshRect } from '../../src/editor/refresh-rect';

const WIDTH = 13;
const HEIGHT = 9;
const SLOTS = 6;

const overlay = (): Overlay => {
  const indices = Uint8Array.from({ length: WIDTH * HEIGHT }, (_, at) => (at * 7 + (at >> 3)) % SLOTS);
  const table = Uint8ClampedArray.from({ length: SLOTS * CHANNELS }, (_, at) => (at * 37 + 11) % 256);
  const rgba = new Uint8ClampedArray(WIDTH * HEIGHT * CHANNELS);
  trackPixels(rgba);
  return { width: WIDTH, height: HEIGHT, base: indices.slice(), indices, rgba, table, dirty: null, mask: null, revision: 0 };
};

const reference = (source: Overlay, rect: { x: number; y: number; width: number; height: number }): number[] => {
  const out = new Array<number>(source.rgba.length).fill(0);
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const slot = (source.indices[y * WIDTH + x] ?? 0) * CHANNELS;
      for (let channel = 0; channel < CHANNELS; channel += 1) out[(y * WIDTH + x) * CHANNELS + channel] = source.table[slot + channel] ?? 0;
    }
  }
  return out;
};

describe('refreshRect', () => {
  it('writes the palette colour of every index in the rectangle and nothing outside it', () => {
    const target = overlay();
    const rect = { x: 3, y: 2, width: 7, height: 4 };
    refreshRect(target, rect);
    expect(Array.from(target.rgba)).toEqual(reference(target, rect));
  });

  it('covers the whole image in one call', () => {
    const target = overlay();
    const rect = { x: 0, y: 0, width: WIDTH, height: HEIGHT };
    refreshRect(target, rect);
    expect(Array.from(target.rgba)).toEqual(reference(target, rect));
  });

  it('reports the refreshed rectangle as dirty once', () => {
    const target = overlay();
    refreshRect(target, { x: 1, y: 1, width: 2, height: 2 });
    refreshRect(target, { x: 5, y: 4, width: 3, height: 1 });
    expect(takeDirty(target.rgba)).toEqual({ x: 1, y: 1, width: 7, height: 4 });
    expect(takeDirty(target.rgba)).toBeNull();
  });
});
