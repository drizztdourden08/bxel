/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { revealDelta } from '../../src/views/PixelViewport/behavior/reveal-delta';
import type { ViewBox, ViewTarget } from '../../src/views/PixelViewport/behavior/viewport.type';

const box: ViewBox = { width: 200, height: 100, dpr: 1, margin: 0, step: 32 };
const target: ViewTarget = { zoom: 10, pan: { x: 50, y: 50 } };

describe('revealing a pixel in the view', () => {
  it('does not pan for a pixel well inside the view', () => {
    expect(revealDelta({ x: 50, y: 50 }, target, box)).toEqual({ x: 0, y: 0 });
  });

  it('pans right for a pixel past the right edge, in image pixels', () => {
    const delta = revealDelta({ x: 62, y: 50 }, target, box);
    expect(delta.x).toBeGreaterThan(0);
    expect(delta.y).toBe(0);
  });

  it('pans up for a pixel above the view', () => {
    const delta = revealDelta({ x: 50, y: 40 }, target, box);
    expect(delta.y).toBeLessThan(0);
    expect(delta.x).toBe(0);
  });
});
