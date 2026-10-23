/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { mirrorPoints, paintStroke } from '../../packages/raster/src/index';
import type { BrushShape, Point, Symmetry } from '../../packages/raster/src/index';
import { blankBuffer } from './blank-buffer';
import { isMirrored } from './is-mirrored';
import { toRows } from './to-rows';

const at = (x: number, y: number): Point => ({ x, y });
const PATH = [at(1, 1), at(2, 3)];

describe('mirror points', () => {
  test('no axes gives the stroke back unchanged', () => {
    expect(mirrorPoints({ points: PATH, symmetry: {} })).toEqual([PATH]);
    expect(mirrorPoints({ points: PATH, symmetry: { x2: null, y2: null } })).toEqual([PATH]);
  });

  test('a vertical axis on a grid line (even) maps x to axis - 1 - x', () => {
    expect(mirrorPoints({ points: [at(1, 2), at(2, 3)], symmetry: { x2: 8 } })).toEqual([
      [at(1, 2), at(2, 3)],
      [at(6, 2), at(5, 3)],
    ]);
  });

  test('a vertical axis through a pixel centre (odd) keeps that pixel in place', () => {
    const [, mirrored] = mirrorPoints({ points: [at(3, 0), at(1, 0)], symmetry: { x2: 7 } });
    expect(mirrored).toEqual([at(3, 0), at(5, 0)]);
  });

  test('a horizontal axis maps y', () => {
    expect(mirrorPoints({ points: [at(1, 2)], symmetry: { y2: 5 } })).toEqual([[at(1, 2)], [at(1, 2)]]);
    expect(mirrorPoints({ points: [at(1, 1)], symmetry: { y2: 6 } })).toEqual([[at(1, 1)], [at(1, 4)]]);
  });

  test('both axes give four strokes: original, across x, across y, across both', () => {
    expect(mirrorPoints({ points: [at(1, 2), at(2, 3)], symmetry: { x2: 7, y2: 5 } })).toEqual([
      [at(1, 2), at(2, 3)],
      [at(5, 2), at(4, 3)],
      [at(1, 2), at(2, 1)],
      [at(5, 2), at(4, 1)],
    ]);
  });

  test('the span of a brush shifts even sizes so the stamp mirrors exactly', () => {
    expect(mirrorPoints({ points: [at(1, 2)], symmetry: { x2: 7 } })[1]).toEqual([at(5, 2)]);
    expect(mirrorPoints({ points: [at(1, 2)], symmetry: { x2: 7 }, span: 2 })[1]).toEqual([at(4, 2)]);
    expect(mirrorPoints({ points: [at(1, 2)], symmetry: { x2: 7 }, span: 3 })[1]).toEqual([at(5, 2)]);
  });
});

type StrokeCase = { readonly name: string; readonly symmetry: Symmetry; readonly rows: readonly string[] };

const STROKES: readonly StrokeCase[] = [
  { name: 'across a grid line', symmetry: { x2: 8 }, rows: ['........', '.1....1.', '..1..1..', '..1..1..', '........', '........', '........', '........'] },
  { name: 'across a pixel centre', symmetry: { x2: 7 }, rows: ['........', '.1...1..', '..1.1...', '..1.1...', '........', '........', '........', '........'] },
  { name: 'across a horizontal axis', symmetry: { y2: 7 }, rows: ['........', '.1......', '..1.....', '..1.....', '..1.....', '.1......', '........', '........'] },
  { name: 'across both axes', symmetry: { x2: 8, y2: 7 }, rows: ['........', '.1....1.', '..1..1..', '..1..1..', '..1..1..', '.1....1.', '........', '........'] },
];

describe('mirrored strokes', () => {
  test.each(STROKES)('$name', ({ symmetry, rows }) => {
    const target = blankBuffer(8, 8);
    paintStroke({ target, points: PATH, index: 1, brush: { shape: 'square', size: 1 }, symmetry });
    expect(toRows(target)).toEqual(rows);
  });

  test('the changed rectangle spans the stroke and its mirror', () => {
    const target = blankBuffer(8, 8);
    const rect = paintStroke({ target, points: PATH, index: 1, brush: { shape: 'square', size: 1 }, symmetry: { x2: 8 } });
    expect(rect).toEqual({ x: 1, y: 1, width: 6, height: 3 });
  });

  test('an even brush mirrors exactly across a pixel centre', () => {
    const target = blankBuffer(9, 9);
    const points = [at(1, 1), at(3, 2)];
    paintStroke({ target, points, index: 1, brush: { shape: 'square', size: 2 }, symmetry: { x2: 9 } });
    expect(toRows(target).slice(0, 5)).toEqual(['.........', '.11...11.', '.1111111.', '..11111..', '.........']);
  });

  test('a stroke that crosses the axis joins up with its mirror', () => {
    const target = blankBuffer(8, 3);
    paintStroke({ target, points: [at(2, 1), at(4, 1)], index: 1, brush: { shape: 'square', size: 1 }, symmetry: { x2: 8 } });
    expect(toRows(target)).toEqual(['........', '..1111..', '........']);
  });
});

const SHAPES: readonly BrushShape[] = ['square', 'circle'];
const SIZES = [1, 2, 3, 4, 5, 6];
const AXES = [12, 11];
const COMBOS = SHAPES.flatMap((shape) => SIZES.flatMap((size) => AXES.map((axis) => ({ shape, size, axis }))));
const SCRIBBLE = [at(3, 3), at(8, 4), at(4, 8), at(7, 7), at(5, 5), at(3, 8)];

describe('mirrored strokes are exact for every brush', () => {
  test.each(COMBOS)('$shape of size $size, axes at $axis', ({ shape, size, axis }) => {
    const target = blankBuffer(12, 12);
    const symmetry = { x2: axis, y2: axis };
    paintStroke({ target, points: SCRIBBLE, index: 1, brush: { shape, size }, symmetry });
    expect(isMirrored(target, symmetry)).toBe(true);
  });
});
