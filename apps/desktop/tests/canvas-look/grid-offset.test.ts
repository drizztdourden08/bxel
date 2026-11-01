/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { CANVAS_DEFAULTS } from '../../src/canvas-look/canvas-look.constants';
import type { GridLine } from '../../src/canvas-look/canvas-look.type';
import { lookOf } from '../../src/canvas-look/look-of';
import { paintGrid } from '../../src/views/PixelViewport/behavior/paint-grid';
import type { GridContext } from '../../src/views/PixelViewport/behavior/paint-grid.type';

interface Stroke {
  verticals: number[];
  horizontals: number[];
}

const strokeOf = (line: GridLine, image: { width: number; height: number }): Stroke => {
  const verticals: number[] = [];
  const horizontals: number[] = [];
  let from = { x: 0, y: 0 };
  const ctx: GridContext = {
    canvas: { width: 200, height: 200 },
    globalAlpha: 1,
    lineWidth: 1,
    strokeStyle: '',
    beginPath: () => undefined,
    save: () => undefined,
    restore: () => undefined,
    stroke: () => undefined,
    rect: () => undefined,
    clip: () => undefined,
    moveTo: (x: number, y: number) => {
      from = { x, y };
    },
    lineTo: (x: number, y: number) => {
      if (x === from.x) verticals.push(x);
      else if (y === from.y) horizontals.push(y);
    },
  };
  paintGrid(ctx, { x: 0, y: 0, scale: 10, width: image.width * 10, height: image.height * 10 }, image, line);
  return { verticals, horizontals };
};

const base: GridLine = { colour: '#ffffff', opacity: 1, every: 2 };

describe('K1 grid offset', { tags: ['critical'] }, () => {
  it('starts the lines at the edge when there is no offset', () => {
    expect(strokeOf(base, { width: 8, height: 8 }).verticals).toEqual([0.5, 20.5, 40.5, 60.5, 80.5]);
  });

  it('shifts the lines across and down by the offset', () => {
    const shown = strokeOf({ ...base, offsetX: 1, offsetY: 3 }, { width: 8, height: 8 });
    expect(shown.verticals).toEqual([10.5, 30.5, 50.5, 70.5]);
    expect(shown.horizontals).toEqual([10.5, 30.5, 50.5, 70.5]);
  });

  it('keeps every line inside the image for a negative offset', () => {
    const shown = strokeOf({ ...base, offsetX: -1 }, { width: 8, height: 8 });
    expect(shown.verticals).toEqual([10.5, 30.5, 50.5, 70.5]);
  });

  it('reads the offset from the settings and clamps it', () => {
    const look = lookOf({ ...CANVAS_DEFAULTS, gridOffsetX: 5, gridOffsetY: 9999 });
    expect(look.tileLine.offsetX).toBe(5);
    expect(look.tileLine.offsetY).toBe(256);
    expect(look.majorLine.offsetX).toBe(5);
    expect(look.pixelLine.offsetX).toBe(5);
  });

  it('defaults to no offset', () => {
    expect(lookOf(CANVAS_DEFAULTS).tileLine.offsetX).toBe(0);
  });
});
