/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { clipRect } from '../../src/views/Navigator/behavior/clip-rect';
import { fitThumb } from '../../src/views/Navigator/behavior/fit-thumb';
import { visibleRect } from '../../src/views/Navigator/behavior/visible-rect';
import type { PixelView } from '../../src/views/PixelViewport';

const view = (zoom: number, pan: { x: number; y: number }): PixelView => ({
  zoom, pan, originX: 0, originY: 0, width: 400, height: 200, dpr: 1, imageWidth: 64, imageHeight: 32,
});

describe('the navigator geometry', () => {
  it('fits the whole image in the box and keeps its shape', () => {
    const thumb = fitThumb({ width: 64, height: 32 }, { width: 200, height: 152 });
    expect(thumb).toEqual({ width: 200, height: 100, scale: 3.125 });
    expect(fitThumb({ width: 512, height: 512 }, { width: 200, height: 152 }).height).toBe(152);
  });

  it('shows the visible part of the image as a rectangle around the pan', () => {
    expect(visibleRect(view(8, { x: 32, y: 16 }))).toEqual({ x: 7, y: 3.5, width: 50, height: 25 });
  });

  it('cuts the rectangle to the image when the view reaches past an edge', () => {
    const rect = visibleRect(view(2, { x: 10, y: 10 }));
    expect(clipRect(rect, { width: 64, height: 32 })).toEqual({ x: 0, y: 0, width: 64, height: 32 });
  });
});
