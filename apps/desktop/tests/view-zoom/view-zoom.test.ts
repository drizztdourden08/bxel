/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { clampPercent } from '../../src/view-zoom/clamp-percent';
import { ZOOM_PERCENT, ZOOM_PRESETS } from '../../src/view-zoom/view-zoom.constants';
import { rectTarget } from '../../src/views/PixelViewport/behavior/rect-target';
import type { ViewBox } from '../../src/views/PixelViewport/behavior/viewport.type';

const box: ViewBox = { width: 800, height: 600, dpr: 1, margin: 32, step: 32 };

describe('K1 the zoom field', { tags: ['critical'] }, () => {
  it('keeps a percent between 25 and 12800', () => {
    expect(clampPercent(1)).toBe(ZOOM_PERCENT.min);
    expect(clampPercent(999999)).toBe(ZOOM_PERCENT.max);
    expect(clampPercent(12.4)).toBe(25);
  });

  it('offers a ladder that doubles from the least to the greatest percent, for the field, the slider and the chips', () => {
    expect(ZOOM_PRESETS[0]).toBe(ZOOM_PERCENT.min);
    expect(ZOOM_PRESETS[ZOOM_PRESETS.length - 1]).toBe(ZOOM_PERCENT.max);
    ZOOM_PRESETS.slice(1).forEach((stop, index) => expect(stop).toBe((ZOOM_PRESETS[index] ?? 0) * 2));
  });
});

describe('K1 zoom to a rectangle', { tags: ['critical'] }, () => {
  it('centres the rectangle and picks a whole zoom that fits it with room around', () => {
    const target = rectTarget({ x: 10, y: 20, width: 16, height: 8 }, box);
    expect(target.pan).toEqual({ x: 18, y: 24 });
    expect(Number.isInteger(target.zoom)).toBe(true);
    expect(16 * target.zoom).toBeLessThanOrEqual(box.width);
    expect(8 * target.zoom).toBeLessThanOrEqual(box.height);
  });

  it('goes below 100 percent for a rectangle bigger than the box', () => {
    expect(rectTarget({ x: 0, y: 0, width: 1600, height: 1200 }, box).zoom).toBeLessThan(1);
  });
});
