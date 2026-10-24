/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { ellipseMask, fullMask, emptyMask, lassoMask, polygonMask, rectMask } from '@bxel/raster';
import { maskRows } from './mask-rows';

const SIZE = { width: 8, height: 6 };

describe('rectangle mask', () => {
  test('covers the corners inclusively', () => {
    const mask = rectMask(SIZE, { from: { x: 1, y: 1 }, to: { x: 3, y: 2 } });
    expect(maskRows(mask)).toEqual(['........', '.###....', '.###....', '........', '........', '........']);
  });

  test('accepts corners in any order', () => {
    const forward = rectMask(SIZE, { from: { x: 1, y: 1 }, to: { x: 3, y: 2 } });
    const backward = rectMask(SIZE, { from: { x: 3, y: 2 }, to: { x: 1, y: 1 } });
    expect(backward).toEqual(forward);
  });

  test('clips to the canvas', () => {
    const mask = rectMask(SIZE, { from: { x: -2, y: 4 }, to: { x: 1, y: 9 } });
    expect(maskRows(mask)).toEqual(['........', '........', '........', '........', '##......', '##......']);
  });

  test('a rectangle wholly outside is empty', () => {
    expect(rectMask(SIZE, { from: { x: 20, y: 20 }, to: { x: 22, y: 22 } })).toEqual(emptyMask(SIZE));
  });
});

describe('ellipse mask', () => {
  test('fills the outline of an odd ellipse', () => {
    const mask = ellipseMask({ width: 9, height: 7 }, { from: { x: 0, y: 0 }, to: { x: 8, y: 6 } });
    expect(maskRows(mask)).toEqual([
      '..#####..',
      '.#######.',
      '#########',
      '#########',
      '#########',
      '.#######.',
      '..#####..',
    ]);
  });

  test('a circle of four is symmetric', () => {
    const mask = ellipseMask({ width: 6, height: 6 }, { from: { x: 1, y: 1 }, to: { x: 4, y: 4 } });
    expect(maskRows(mask)).toEqual(['......', '..##..', '.####.', '.####.', '..##..', '......']);
  });
});

describe('polygon and lasso masks', () => {
  test('a triangle holds its outline and interior', () => {
    const mask = polygonMask({ width: 9, height: 5 }, [
      { x: 0, y: 4 },
      { x: 4, y: 0 },
      { x: 8, y: 4 },
    ]);
    expect(maskRows(mask)).toEqual(['....#....', '...###...', '..#####..', '.#######.', '#########']);
  });

  test('a concave arrow keeps its notch', () => {
    const mask = polygonMask({ width: 7, height: 6 }, [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 3, y: 2 },
      { x: 6, y: 5 },
      { x: 0, y: 5 },
    ]);
    expect(maskRows(mask)).toEqual(['#######', '######.', '####...', '#####..', '######.', '#######']);
  });

  test('a self crossing bow tie is filled by the even-odd rule', () => {
    const mask = polygonMask({ width: 5, height: 5 }, [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ]);
    expect(maskRows(mask)).toEqual(['#...#', '##.##', '#####', '##.##', '#...#']);
  });

  test('one or two vertices trace a pixel or a line', () => {
    expect(maskRows(polygonMask({ width: 4, height: 2 }, [{ x: 1, y: 1 }]))).toEqual(['....', '.#..']);
    expect(maskRows(polygonMask({ width: 4, height: 2 }, [{ x: 0, y: 0 }, { x: 3, y: 1 }]))).toEqual(['##..', '..##']);
    expect(polygonMask(SIZE, [])).toEqual(emptyMask(SIZE));
  });

  test('the lasso drops repeated samples and matches the polygon', () => {
    const points = [
      { x: 1, y: 1 },
      { x: 1.4, y: 1.2 },
      { x: 5, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 4 },
      { x: 1, y: 4 },
    ];
    const lasso = lassoMask(SIZE, points);
    expect(lasso).toEqual(polygonMask(SIZE, points));
    expect(maskRows(lasso)).toEqual(['........', '.#####..', '.#####..', '.#####..', '.#####..', '........']);
  });

  test('vertices outside the canvas are clipped', () => {
    const mask = polygonMask({ width: 4, height: 4 }, [
      { x: -3, y: -3 },
      { x: 9, y: -3 },
      { x: 9, y: 1 },
      { x: -3, y: 1 },
    ]);
    expect(maskRows(mask)).toEqual(['####', '####', '....', '....']);
  });
});

describe('select all and clear', () => {
  test('select all sets every pixel and clear unsets them', () => {
    expect(maskRows(fullMask({ width: 3, height: 2 }))).toEqual(['###', '###']);
    expect(maskRows(emptyMask({ width: 3, height: 2 }))).toEqual(['...', '...']);
  });
});
