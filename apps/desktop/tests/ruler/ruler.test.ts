/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { snapAxis } from '../../src/editor/snap-axis';
import { axisFromRuler } from '../../src/ruler/axis-from-ruler';
import { handlePosition } from '../../src/ruler/handle-position';
import { labelStep } from '../../src/ruler/label-step';
import { minorStep } from '../../src/ruler/minor-step';
import { nearHandle } from '../../src/ruler/near-handle';
import type { RulerSpan } from '../../src/ruler/ruler.type';
import { rulerTicks } from '../../src/ruler/ruler-ticks';

const positionsAt = (zoom: number): number[] => rulerTicks({ origin: -37.5, zoom, length: 400, count: 256 }).map((tick) => tick.at);

describe('ruler steps', () => {
  it('labels fewer pixels at low zoom and every pixel at high zoom', () => {
    expect([0.5, 1, 2, 4, 8, 16, 32, 64].map(labelStep)).toEqual([100, 50, 50, 20, 10, 5, 2, 1]);
  });

  it('keeps labels at least 48 screen pixels apart', () => {
    [0.25, 0.5, 1, 3, 6, 12, 24, 48].forEach((zoom) => {
      expect(labelStep(zoom) * zoom).toBeGreaterThanOrEqual(48);
    });
  });

  it('splits a label step into whole minor steps', () => {
    expect([1, 2, 5, 10, 20, 50, 100, 200, 500].map(minorStep)).toEqual([1, 1, 1, 2, 10, 10, 20, 100, 100]);
    [1, 2, 5, 10, 20, 50, 100, 200, 500].forEach((label) => expect(label % minorStep(label)).toBe(0));
  });
});

describe('ruler ticks', () => {
  const span = (origin: number, zoom: number, length: number, count: number): RulerSpan => ({ origin, zoom, length, count });

  it('places ticks from the origin with the label every 20 pixels at 4x', () => {
    const ticks = rulerTicks(span(10, 4, 200, 32));
    expect(ticks.map((tick) => tick.value)).toEqual([0, 10, 20, 30, 32]);
    expect(ticks.map((tick) => tick.at)).toEqual([10, 50, 90, 130, 138]);
    expect(ticks.map((tick) => tick.label)).toEqual([true, false, true, false, false]);
  });

  it('follows the pan and drops the ticks that are out of view', () => {
    const ticks = rulerTicks(span(-100, 4, 120, 32));
    expect(ticks.map((tick) => tick.value)).toEqual([30, 32]);
    expect(ticks.map((tick) => tick.at)).toEqual([20, 28]);
  });

  it('stops at the sprite size and never ends the ruler past the view', () => {
    const wide = rulerTicks(span(0, 1, 100, 64));
    expect(wide.map((tick) => tick.value)).toEqual([0, 10, 20, 30, 40, 50, 60, 64]);
    expect(wide.filter((tick) => tick.label).map((tick) => tick.value)).toEqual([0, 50]);
    const cut = rulerTicks(span(0, 64, 320, 16));
    expect(cut.map((tick) => tick.value)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(cut.every((tick) => tick.label)).toBe(true);
  });

  it('gives ticks that all fall inside the ruler', () => {
    const inside = [0.5, 1, 3, 8, 24, 64].flatMap(positionsAt);
    expect(inside.length).toBeGreaterThan(0);
    expect(Math.min(...inside)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...inside)).toBeLessThanOrEqual(400);
  });
});

describe('mirror axis snapping', () => {
  it('snaps to the half pixel in doubled integers', () => {
    expect(snapAxis(3.2, 16, false)).toBe(6);
    expect(snapAxis(3.3, 16, false)).toBe(7);
    expect(snapAxis(3.76, 16, false)).toBe(8);
  });

  it('snaps to whole grid lines when asked', () => {
    expect(snapAxis(3.3, 16, true)).toBe(6);
    expect(snapAxis(3.6, 16, true)).toBe(8);
  });

  it('stays inside the sprite', () => {
    expect(snapAxis(-4, 16, false)).toBe(0);
    expect(snapAxis(99, 16, false)).toBe(32);
    expect(snapAxis(99, 16, true)).toBe(32);
  });

  it('maps a ruler position to the axis through the origin and the zoom', () => {
    const view = { origin: 10, zoom: 4, length: 200, count: 16 };
    expect(axisFromRuler(22, view, false)).toBe(6);
    expect(axisFromRuler(24, view, false)).toBe(7);
    expect(axisFromRuler(26, view, false)).toBe(8);
    expect(axisFromRuler(24, view, true)).toBe(8);
    expect(axisFromRuler(-50, view, false)).toBe(0);
    expect(axisFromRuler(500, view, false)).toBe(32);
  });
});

describe('ruler handles', () => {
  const view = { origin: 10, zoom: 4, length: 200, count: 16 };

  it('sits on the doubled coordinate', () => {
    expect(handlePosition(0, view)).toBe(10);
    expect(handlePosition(7, view)).toBe(24);
    expect(handlePosition(32, view)).toBe(74);
  });

  it('grabs only near its position', () => {
    expect(nearHandle(24, 24)).toBe(true);
    expect(nearHandle(31, 24)).toBe(true);
    expect(nearHandle(32, 24)).toBe(false);
    expect(nearHandle(24, null)).toBe(false);
  });
});
