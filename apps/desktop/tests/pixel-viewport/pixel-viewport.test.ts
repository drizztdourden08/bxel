/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { clampPan } from '../../src/views/PixelViewport/behavior/clamp-pan';
import { fitZoom } from '../../src/views/PixelViewport/behavior/fit-zoom';
import { originOf } from '../../src/views/PixelViewport/behavior/origin-of';
import { pixelToScreen } from '../../src/views/PixelViewport/behavior/pixel-to-screen';
import { screenToPixel } from '../../src/views/PixelViewport/behavior/screen-to-pixel';
import { stepZoom } from '../../src/views/PixelViewport/behavior/step-zoom';
import type { ViewBox, ViewTarget } from '../../src/views/PixelViewport/behavior/viewport.type';
import { wheelSteps } from '../../src/views/PixelViewport/behavior/wheel-steps';
import { zoomAt } from '../../src/views/PixelViewport/behavior/zoom-at';
import { zoomLevels } from '../../src/views/PixelViewport/behavior/zoom-levels';
import { PIXEL_ZOOM_STEPS } from '../../src/views/PixelViewport/PixelViewport.constants';
import type { PixelPoint } from '../../src/views/PixelViewport/PixelViewport.type';

const boxOf = (dpr = 1): ViewBox => ({ width: 800, height: 600, dpr, margin: 32, step: 32 });
const image = { width: 64, height: 48 };
const centreOfPixel = (pixel: PixelPoint, target: ViewTarget, box: ViewBox): PixelPoint => {
  const corner = pixelToScreen(pixel, target, box);
  return { x: corner.x + target.zoom / 2, y: corner.y + target.zoom / 2 };
};

describe('zoom at the pointer', () => {
  it.each([1, 2])('keeps the pixel under the pointer fixed through every step at DPR %i', (dpr) => {
    const box = boxOf(dpr);
    const levels = zoomLevels(PIXEL_ZOOM_STEPS, fitZoom(image, box));
    let target: ViewTarget = { zoom: 1, pan: { x: 20, y: 14 } };
    const pixel = { x: 9, y: 31 };
    const anchor = centreOfPixel(pixel, target, box);
    levels.forEach(() => {
      target = zoomAt(target, stepZoom(levels, target.zoom, 1), anchor, box);
      expect(screenToPixel(anchor, target, box)).toEqual(pixel);
    });
    expect(target.zoom).toBe(128);
    target = zoomAt(target, stepZoom(levels, target.zoom, -1), anchor, box);
    expect(target.zoom).toBe(96);
    expect(screenToPixel(anchor, target, box)).toEqual(pixel);
  });

  it('keeps the exact image point under the anchor, not only its pixel', () => {
    const box = boxOf();
    const before: ViewTarget = { zoom: 3, pan: { x: 10.25, y: 7.5 } };
    const anchor = { x: 123, y: 456 };
    const after = zoomAt(before, 12, anchor, box);
    const under = (t: ViewTarget) => ({ x: t.pan.x + (anchor.x - 400) / t.zoom, y: t.pan.y + (anchor.y - 300) / t.zoom });
    expect(under(after).x).toBeCloseTo(under(before).x, 9);
    expect(under(after).y).toBeCloseTo(under(before).y, 9);
  });
});

describe('zoom levels', () => {
  it('steps by whole factors at and above 1x, down to 25% and up to 128x', () => {
    const levels = zoomLevels(PIXEL_ZOOM_STEPS, 6);
    expect(levels).toEqual([0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
    expect(stepZoom(levels, 4, 1)).toBe(6);
    expect(stepZoom(levels, 6, -1)).toBe(4);
    expect(stepZoom(levels, 128, 1)).toBe(128);
    expect(stepZoom(levels, 1, -1)).toBe(0.5);
    expect(stepZoom(levels, 0.25, -1)).toBe(0.25);
  });

  it('snaps a fractional zoom to the next whole step', () => {
    const levels = zoomLevels(PIXEL_ZOOM_STEPS, 2);
    expect(stepZoom(levels, 2.5, 1)).toBe(3);
    expect(stepZoom(levels, 2.5, -1)).toBe(2);
    expect(stepZoom(levels, 5, 1)).toBe(6);
  });

  it('halves below 1x down to a fractional fit', () => {
    const levels = zoomLevels(PIXEL_ZOOM_STEPS, 0.2);
    expect(levels.slice(0, 5)).toEqual([0.2, 0.25, 0.5, 1, 2]);
    expect(stepZoom(levels, 1, -1)).toBe(0.5);
    expect(stepZoom(levels, 0.25, -1)).toBe(0.2);
  });

  it('fits by a whole factor when the image fits once or more, by a fraction below', () => {
    expect(fitZoom({ width: 16, height: 16 }, boxOf())).toBe(37);
    expect(fitZoom({ width: 64, height: 48 }, boxOf())).toBe(12);
    expect(fitZoom({ width: 1600, height: 600 }, boxOf())).toBe(0.5);
    expect(fitZoom({ width: 16, height: 16 }, { ...boxOf(), width: 0, height: 0 })).toBe(1);
  });

  it('takes the steps the app passes, rounded and sorted', () => {
    expect(zoomLevels([8, 1, 4, 4, 2.4], 3)).toEqual([0.25, 0.5, 1, 2, 4, 8]);
  });
});

describe('pan clamp', () => {
  it.each([1, 4, 32])('keeps a margin of the image on screen at %ix', (zoom) => {
    const box = boxOf();
    for (const far of [-1e6, 1e6]) {
      const target: ViewTarget = { zoom, pan: clampPan({ x: far, y: far }, zoom, image, box) };
      const left = pixelToScreen({ x: 0, y: 0 }, target, box);
      const right = pixelToScreen({ x: image.width, y: image.height }, target, box);
      expect(right.x).toBeGreaterThanOrEqual(box.margin - 0.5);
      expect(right.y).toBeGreaterThanOrEqual(box.margin - 0.5);
      expect(left.x).toBeLessThanOrEqual(box.width - box.margin + 0.5);
      expect(left.y).toBeLessThanOrEqual(box.height - box.margin + 0.5);
    }
  });

  it('leaves a pan inside the reach alone', () => {
    expect(clampPan({ x: 3, y: 40 }, 4, image, boxOf())).toEqual({ x: 3, y: 40 });
  });
});

describe('screen and pixel mapping', () => {
  it.each([1, 2])('round trips at DPR %i over whole and fractional zooms', (dpr) => {
    const box = boxOf(dpr);
    for (const zoom of [0.37, 1, 3, 12, 64]) {
      const target: ViewTarget = { zoom, pan: { x: 21.3, y: 17.9 } };
      const origin = originOf(target, box);
      expect(Number.isInteger(Math.round(origin.x * dpr * 1e9) / 1e9)).toBe(true);
      for (const pixel of [{ x: 0, y: 0 }, { x: 5, y: 7 }, { x: 63, y: 47 }, { x: -3, y: 50 }]) {
        expect(screenToPixel(pixelToScreen(pixel, target, box), target, box)).toEqual(pixel);
        expect(screenToPixel(centreOfPixel(pixel, target, box), target, box)).toEqual(pixel);
      }
    }
  });

  it('puts the pan point at the centre of the view', () => {
    const box = boxOf();
    expect(pixelToScreen({ x: 32, y: 24 }, { zoom: 8, pan: { x: 32, y: 24 } }, box)).toEqual({ x: 400, y: 300 });
  });
});

describe('wheel steps', () => {
  it('takes a mouse notch as one step and adds small pinch deltas up', () => {
    expect(wheelSteps(0, -100)).toEqual({ steps: 1, carried: 0 });
    expect(wheelSteps(0, 120)).toEqual({ steps: -1, carried: 0 });
    let state = { steps: 0, carried: 0 };
    const seen: number[] = [];
    for (let tick = 0; tick < 8; tick += 1) {
      state = wheelSteps(state.carried, -10);
      seen.push(state.steps);
    }
    expect(seen).toEqual([0, 0, 0, 0, 0, 1, 0, 0]);
    expect(wheelSteps(-30, 10)).toEqual({ steps: 0, carried: 10 });
  });
});
