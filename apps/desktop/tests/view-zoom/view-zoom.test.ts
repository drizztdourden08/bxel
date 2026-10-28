/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { clampPercent } from '../../src/view-zoom/clamp-percent';
import { parsePercent } from '../../src/view-zoom/parse-percent';
import { percentToSlider } from '../../src/view-zoom/percent-to-slider';
import { sliderToPercent } from '../../src/view-zoom/slider-to-percent';
import { DIGIT_ZOOM, ZOOM_PERCENT, ZOOM_PRESETS, ZOOM_SLIDER } from '../../src/view-zoom/view-zoom.constants';
import { rectTarget } from '../../src/views/PixelViewport/behavior/rect-target';
import type { ViewBox } from '../../src/views/PixelViewport/behavior/viewport.type';

const box: ViewBox = { width: 800, height: 600, dpr: 1, margin: 32, step: 32 };

describe('the zoom field', () => {
  it('reads a typed percent with or without the sign and keeps it between 25 and 12800', () => {
    expect(parsePercent('800')).toBe(800);
    expect(parsePercent(' 66 % ')).toBe(66);
    expect(parsePercent('1')).toBe(ZOOM_PERCENT.min);
    expect(parsePercent('999999')).toBe(ZOOM_PERCENT.max);
    expect(parsePercent('abc')).toBeNull();
    expect(parsePercent('')).toBeNull();
    expect(clampPercent(12.4)).toBe(25);
  });

  it('keeps every preset inside the allowed range and every digit on a preset', () => {
    expect(ZOOM_PRESETS.every((preset) => preset >= ZOOM_PERCENT.min && preset <= ZOOM_PERCENT.max)).toBe(true);
    expect(Object.values(DIGIT_ZOOM)).toEqual([100, 200, 400, 800, 1600, 3200]);
    expect(ZOOM_PRESETS[0]).toBe(25);
    expect(ZOOM_PRESETS.at(-1)).toBe(12800);
  });

  it('maps the slider on a log scale that reaches both ends and round trips the presets', () => {
    expect(percentToSlider(ZOOM_PERCENT.min)).toBe(ZOOM_SLIDER.min);
    expect(percentToSlider(ZOOM_PERCENT.max)).toBe(ZOOM_SLIDER.max);
    for (const preset of ZOOM_PRESETS) expect(sliderToPercent(percentToSlider(preset))).toBeCloseTo(preset, -1);
    expect(percentToSlider(200) - percentToSlider(100)).toBe(percentToSlider(400) - percentToSlider(200));
  });
});

describe('zoom to a rectangle', () => {
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
