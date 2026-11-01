/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { trackPixels } from '../../src/canvas-dirty/track-pixels';
import { CHANNELS } from '../../src/editor/bank-table.constants';
import type { Overlay } from '../../src/editor/editor.type';
import { refreshRect } from '../../src/editor/refresh-rect';

const WIDTH = 4;
const HEIGHT = 1;
const FULL = { x: 0, y: 0, width: WIDTH, height: HEIGHT };

const paint = (rgba: number[][]): Uint8Array => Uint8Array.from(rgba.flat());

const overlay = (alpha: number): Overlay => {
  const indices = Uint8Array.from([0, 1, 0, 1]);
  const rgba = new Uint8ClampedArray(WIDTH * HEIGHT * CHANNELS);
  trackPixels(rgba);
  return {
    width: WIDTH,
    height: HEIGHT,
    base: Uint8Array.from([0, 0, 1, 1]),
    indices,
    rgba,
    table: Uint8ClampedArray.from([0, 0, 0, 0, 200, 100, 50, 255]),
    dirty: null,
    mask: null,
    revision: 0,
    view: {
      alpha,
      below: paint([[10, 10, 10, 255], [10, 10, 10, 255], [10, 10, 10, 255], [10, 10, 10, 255]]),
      above: paint([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 255, 255]]),
      committed: paint([[10, 10, 10, 255], [90, 90, 90, 255], [150, 70, 40, 255], [150, 70, 40, 255]]),
    },
  };
};

const pixel = (target: Overlay, at: number): number[] => Array.from(target.rgba.slice(at * CHANNELS, at * CHANNELS + CHANNELS));

describe('K1 refreshRect with a view opacity', { tags: ['critical'] }, () => {
  it('leaves the pixels the stroke has not changed as the committed image shows them', () => {
    const target = overlay(0.5);
    refreshRect(target, FULL);
    expect(pixel(target, 0)).toEqual([10, 10, 10, 255]);
  });

  it('shows a stroke pixel as the palette colour at the layer opacity over what lies below', () => {
    const target = overlay(0.5);
    refreshRect(target, FULL);
    expect(pixel(target, 1)).toEqual([105, 55, 30, 255]);
  });

  it('shows what lies below where the stroke erased a pixel', () => {
    const target = overlay(0.5);
    refreshRect(target, FULL);
    expect(pixel(target, 2)).toEqual([10, 10, 10, 255]);
  });

  it('keeps layers above the stroke layer on top of the stroke pixel', () => {
    const target = overlay(0.5);
    target.indices[3] = 0;
    refreshRect(target, FULL);
    expect(pixel(target, 3)).toEqual([0, 0, 255, 255]);
  });

  it('writes the full colour when the opacity is one', () => {
    const target = overlay(1);
    refreshRect(target, FULL);
    expect(pixel(target, 1)).toEqual([200, 100, 50, 255]);
  });
});
