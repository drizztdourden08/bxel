/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectOneUndo, expectPreviewEqualsCommit, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { rowsIds, rowsArtwork } from './rows-artwork';
import { dimsOf } from './transform-checks';

const RING = ['..........', '...1111...', '..1....1..', '.1..22..1.', '.1..22..1.', '.1......1.', '..1....1..', '...1111...', '..........', '..........'];
const SOLID = ['1111', '1111', '1111', '1111'];
const scope = scopeOf([rowsIds.sprite]);
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);
const run = (rows: readonly string[], name: string, options: Record<string, unknown>) => {
  const engine = pixelEngine(rowsArtwork(rows));
  const result = okOf(engine.execute(request([stepOf(name, scope, options)])));
  return { engine, result, rows: rowsOf(engine) };
};
const stripedDisc = (side: number): string[] => {
  const rows: string[] = [];
  for (let y = 0; y < side; y++) {
    let row = '';
    for (let x = 0; x < side; x++) row += (x + y) % 7 < 3 && Math.hypot(x - side / 2, y - side / 2) < side * 0.45 ? '1' : '.';
    rows.push(row);
  }
  return rows;
};
const colours = (rows: readonly string[]): Set<string> => new Set(rows.join('').replaceAll('.', ''));

describe('pixels.rotate algorithms', () => {
  test.each(['rotsprite', 'cleanedge'] as const)('%s never adds a colour and reports it', (algorithm) => {
    for (const angle of [15, 30, 45, 77, 123, -50]) {
      const { rows, result } = run(RING, 'pixels.rotate', { angle, algorithm, pivot: { x2: 10, y2: 10 } });
      for (const colour of colours(rows)) expect(colours(RING).has(colour)).toBe(true);
      expect(result.report['colorsAdded']).toBe(0);
    }
  });

  test.each([0, 90, 180, 270, -90] as const)('rotsprite at %i degrees equals the exact turn', (angle) => {
    const exact = run(RING, 'pixels.rotate', { angle, pivot: { x2: 10, y2: 10 } });
    const smooth = run(RING, 'pixels.rotate', { angle, algorithm: 'rotsprite', pivot: { x2: 10, y2: 10 } });
    expect(smooth.rows).toEqual(exact.rows);
  });

  test('rotsprite keeps a thick shape rounder than nearest at 30 degrees', () => {
    const nearest = run(RING, 'pixels.rotate', { angle: 30, pivot: { x2: 10, y2: 10 } });
    const smooth = run(RING, 'pixels.rotate', { angle: 30, algorithm: 'rotsprite', pivot: { x2: 10, y2: 10 } });
    expect(smooth.rows).not.toEqual(nearest.rows);
  });

  test('a 45 degree rotsprite of a 32 by 32 sprite runs quickly', () => {
    const rows = stripedDisc(32);
    const engine = pixelEngine(rowsArtwork(rows));
    const started = performance.now();
    okOf(engine.execute(request([stepOf('pixels.rotate', scope, { angle: 45, algorithm: 'rotsprite', pivot: { x2: 32, y2: 32 } })])));
    expect(performance.now() - started).toBeLessThan(50);
  });

  test('the preview equals the commit and one undo restores the pixels', () => {
    const engine = pixelEngine(rowsArtwork(RING));
    const original = engine.state().artwork;
    const step = stepOf('pixels.rotate', scope, { angle: 33, algorithm: 'rotsprite', pivot: { x2: 10, y2: 10 } });
    expectPreviewEqualsCommit(rowsArtwork(RING), step);
    okOf(engine.execute(request([step])));
    expectOneUndo(engine, original);
  });
});

describe('pixels.scale algorithms', () => {
  test.each(['scale2x', 'scale3x', 'mmpx', 'rotsprite'] as const)('%s doubles without a new colour', (algorithm) => {
    const { rows, result } = run(RING, 'pixels.scale', { target: { by: 'factor', x: 2, y: 2 }, algorithm, bounds: 'expand' });
    expect(rows).toHaveLength(20);
    for (const colour of colours(rows)) expect(colours(RING).has(colour)).toBe(true);
    expect(result.report['colorsAdded']).toBe(0);
  });

  test('scale2x rounds the corner of a staircase', () => {
    const { rows } = run(['....', '.1..', '11..', '....'], 'pixels.scale', { target: { by: 'factor', x: 2, y: 2 }, algorithm: 'scale2x', bounds: 'expand' });
    const nearest = run(['....', '.1..', '11..', '....'], 'pixels.scale', { target: { by: 'factor', x: 2, y: 2 }, bounds: 'expand' });
    expect(rows).not.toEqual(nearest.rows);
  });
});

describe('pixels.transform', () => {
  test('a rotation equals pixels.rotate with the same pivot', () => {
    const pivot = { x2: 10, y2: 10 };
    const rotated = run(RING, 'pixels.rotate', { angle: 30, pivot });
    const transformed = run(RING, 'pixels.transform', { angle: 30, pivot });
    expect(transformed.rows).toEqual(rotated.rows);
  });

  test('a rotsprite transform equals a rotsprite rotate', () => {
    const pivot = { x2: 10, y2: 10 };
    const rotated = run(RING, 'pixels.rotate', { angle: 30, algorithm: 'rotsprite', pivot });
    const transformed = run(RING, 'pixels.transform', { angle: 30, algorithm: 'rotsprite', pivot });
    expect(transformed.rows).toEqual(rotated.rows);
  });

  test('scale 2 about the middle doubles a block and offset moves it', () => {
    const { rows } = run(['......', '..11..', '..11..', '......', '......', '......'], 'pixels.transform', {
      scale: { x: 2, y: 2 },
      offset: { x: 0, y: 1 },
      mask: maskFromRows(['......', '..##..', '..##..', '......', '......', '......']),
    });
    expect(rows).toEqual(['......', '.1111.', '.1111.', '.1111.', '.1111.', '......']);
  });

  test('skew leans the rows', () => {
    const { rows } = run(['.........', '..111....', '..111....', '..111....', '.........'], 'pixels.transform', { skew: { x: 45, y: 0 } });
    expect(rows[1]).not.toEqual(rows[3]);
    expect(rows.join('').split('1')).toHaveLength(10);
  });

  test('a flat transform is refused', () => {
    const engine = pixelEngine(rowsArtwork(SOLID));
    expect(errorOf(engine.execute(request([stepOf('pixels.transform', scope, { scale: { x: 0, y: 1 } })]))).code).toBeDefined();
  });

  test('expand grows the sprite for a big rotation', () => {
    const { engine } = run(SOLID, 'pixels.transform', { angle: 45, bounds: 'expand' });
    expect(dimsOf(engine, rowsIds.sprite).width).toBeGreaterThan(4);
  });
});

describe('pixels.distort', () => {
  test('the box corners where they are change nothing', () => {
    const { rows } = run(RING, 'pixels.distort', { corners: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }] });
    expect(rows).toEqual(RING);
  });

  test('pulling the top corners in makes a trapezoid and keeps the colours', () => {
    const { rows } = run(['1111', '1111', '1111', '1111'], 'pixels.distort', { corners: [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }] });
    expect(rows[0]).toBe('.11.');
    expect(rows[3]).toBe('1111');
  });

  test('corners that cross are refused', () => {
    const engine = pixelEngine(rowsArtwork(SOLID));
    const corners = [{ x: 0, y: 0 }, { x: 4, y: 4 }, { x: 4, y: 0 }, { x: 0, y: 4 }];
    expect(errorOf(engine.execute(request([stepOf('pixels.distort', scope, { corners })]))).code).toBeDefined();
  });
});
