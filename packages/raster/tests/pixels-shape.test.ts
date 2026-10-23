/* @layer tests @kind test */
import { drawShape } from '@bxel/raster';
import type { ShapeKind } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { blankBuffer } from './blank-buffer';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { createdCelRows, errorOf, okOf } from './result-checks';
import { emptyProject, rowsIds } from './rows-project';
import { toRows } from './to-rows';

const FROM = { x: 1, y: 1 };
const TO = { x: 6, y: 4 };

const shapeRequest = (options: Record<string, unknown>) =>
  request([stepOf('pixels.shape', scopeOf([rowsIds.sprite]), { from: FROM, to: TO, index: 2, ...options })]);

const drawn = (shape: ShapeKind, filled: boolean): string[] => {
  const engine = pixelEngine(emptyProject(8, 6));
  okOf(engine.execute(shapeRequest({ shape, filled })));
  return createdCelRows(engine.state().project, rowsIds.sprite);
};

const direct = (shape: ShapeKind, filled: boolean): string[] => {
  const target = blankBuffer(8, 6);
  drawShape({ target, shape, from: FROM, to: TO, index: 2, filled });
  return toRows(target);
};

describe('pixels.shape', () => {
  test('draws a rect outline', () => {
    expect(drawn('rect', false)).toEqual(['........', '.222222.', '.2....2.', '.2....2.', '.222222.', '........']);
  });

  test('draws a filled rect', () => {
    expect(drawn('rect', true)).toEqual(['........', '.222222.', '.222222.', '.222222.', '.222222.', '........']);
  });

  test.each([
    ['line', false],
    ['rect', true],
    ['ellipse', false],
    ['ellipse', true],
  ] as const)('a %s with filled %s matches the direct rasterizer', (shape, filled) => {
    expect(drawn(shape, filled)).toEqual(direct(shape, filled));
    expect(drawn(shape, filled).join('')).toContain('2');
  });

  test('clips a shape that leaves the sprite', () => {
    const engine = pixelEngine(emptyProject(4, 4));
    okOf(engine.execute(shapeRequest({ shape: 'rect', filled: true, from: { x: -2, y: -2 }, to: { x: 1, y: 1 } })));
    expect(createdCelRows(engine.state().project, rowsIds.sprite)).toEqual(['22..', '22..', '....', '....']);
  });

  test('rejects an unknown shape and an index at the palette size', () => {
    const engine = pixelEngine(emptyProject(4, 4));
    expect(errorOf(engine.execute(shapeRequest({ shape: 'polygon' }))).path).toBe('steps.0.options.shape');
    expect(errorOf(engine.execute(shapeRequest({ shape: 'line', index: 7 }))).code).toBe('INDEX_OUT_OF_RANGE');
  });
});
