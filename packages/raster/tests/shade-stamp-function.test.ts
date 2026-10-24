/* @layer tests @kind test */
import { shadeStroke, shadeTable, stampPatch } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { blankBuffer } from './blank-buffer';
import { fromRows } from './from-rows';
import { maskFromRows } from './mask-from-rows';
import { toRows } from './to-rows';

const BRUSH = { shape: 'square', size: 1 } as const;

describe('shadeTable', () => {
  test('steps one place up the ramp and stops at its end', () => {
    const table = shadeTable({ slots: [1, 2, 3], direction: 'up', steps: 1 });
    expect([table[1], table[2], table[3]]).toEqual([2, 3, 3]);
  });

  test('steps down and keeps indices that are not on the ramp', () => {
    const table = shadeTable({ slots: [1, 2, 3], direction: 'down', steps: 2 });
    expect([table[0], table[1], table[2], table[3], table[4], table[200]]).toEqual([0, 1, 1, 1, 4, 200]);
  });

  test('a ramp can list slots out of order', () => {
    const table = shadeTable({ slots: [5, 2, 4], direction: 'up', steps: 1 });
    expect([table[5], table[2], table[4]]).toEqual([2, 4, 4]);
  });
});

describe('shadeStroke', () => {
  const table = shadeTable({ slots: [1, 2, 3], direction: 'up', steps: 1 });

  test('shades the painted pixels along the stroke and leaves empty ones', () => {
    const target = fromRows(['1.231']);
    const rect = shadeStroke({ target, table, points: [{ x: 0, y: 0 }, { x: 4, y: 0 }], brush: BRUSH });
    expect(toRows(target)).toEqual(['2.332']);
    expect(rect).toEqual({ x: 0, y: 0, width: 5, height: 1 });
  });

  test('a pixel the brush covers twice still steps once', () => {
    const target = fromRows(['111', '111']);
    shadeStroke({ target, table, points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], brush: { shape: 'square', size: 2 } });
    expect(toRows(target)).toEqual(['222', '222']);
  });

  test('a mask limits the stroke', () => {
    const target = fromRows(['111']);
    shadeStroke({ target, table, mask: maskFromRows(['.#.']), points: [{ x: 0, y: 0 }, { x: 2, y: 0 }], brush: BRUSH });
    expect(toRows(target)).toEqual(['121']);
  });

  test('a stroke over nothing changes nothing', () => {
    const target = blankBuffer(3, 1);
    expect(shadeStroke({ target, table, points: [{ x: 0, y: 0 }, { x: 2, y: 0 }], brush: BRUSH })).toBeNull();
  });
});

describe('stampPatch', () => {
  const patch = fromRows(['12', '.3']);

  test('stamps the patch at each point with its anchor on the point', () => {
    const target = blankBuffer(6, 3);
    const rect = stampPatch({ target, patch, points: [{ x: 1, y: 1 }, { x: 4, y: 1 }], anchor: { x: 0, y: 0 }, skipZero: true });
    expect(toRows(target)).toEqual(['......', '.12.12', '..3..3']);
    expect(rect).toEqual({ x: 1, y: 1, width: 5, height: 2 });
  });

  test('skipZero keeps what is under the empty pixels, and off writes them', () => {
    const kept = fromRows(['555', '555']);
    stampPatch({ target: kept, patch, points: [{ x: 0, y: 0 }], anchor: { x: 0, y: 0 }, skipZero: true });
    expect(toRows(kept)).toEqual(['125', '535']);
    const written = fromRows(['555', '555']);
    stampPatch({ target: written, patch, points: [{ x: 0, y: 0 }], anchor: { x: 0, y: 0 }, skipZero: false });
    expect(toRows(written)).toEqual(['125', '.35']);
  });

  test('defaults the anchor to the middle of the patch and clips at the edge', () => {
    const target = blankBuffer(3, 2);
    stampPatch({ target, patch, points: [{ x: 0, y: 0 }], skipZero: true });
    expect(toRows(target)).toEqual(['3..', '...']);
  });

  test('a mask limits where the patch lands', () => {
    const target = blankBuffer(3, 2);
    stampPatch({ target, patch, points: [{ x: 1, y: 0 }], anchor: { x: 0, y: 0 }, skipZero: true, mask: maskFromRows(['..#', '...']) });
    expect(toRows(target)).toEqual(['..2', '...']);
  });
});
