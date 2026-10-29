/* @layer tests @kind test */
import { evenLinePoints, roundedRect } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { errorOf, okOf, pixelEngine, request, stepOf } from './advanced-kit';
import { at, drawnOnEmpty, rowsAfter, rowsOf, scope } from './draw-kit';
import { rampArtwork } from './ramp-artwork';
import { rowsArtwork } from './rows-artwork';

const run = (rows: readonly string[], name: string, options: Record<string, unknown>): string[] => rowsAfter(rowsArtwork(rows), name, options);

describe('inks on a stroke', () => {
  const stroke = { points: [at(0, 0), at(3, 0)], index: 2 };

  test('normal writes everywhere and behind only over transparent pixels', () => {
    expect(run(['1.1.'], 'pixels.paint', { ...stroke, ink: { kind: 'normal' } })).toEqual(['2222']);
    expect(run(['1.1.'], 'pixels.paint', { ...stroke, ink: { kind: 'behind' } })).toEqual(['1212']);
  });

  test('lock alpha writes only over opaque pixels', () => {
    expect(run(['1.1.'], 'pixels.paint', { ...stroke, ink: { kind: 'lockAlpha' } })).toEqual(['2.2.']);
  });

  test('only colour writes over one index', () => {
    expect(run(['1.31'], 'pixels.paint', { ...stroke, index: 4, ink: { kind: 'onlyColour', index: 1 } })).toEqual(['4.34']);
  });

  test('dither writes the front colour on the pattern and the second colour off it', () => {
    expect(run(['....'], 'pixels.paint', { ...stroke, ink: { kind: 'dither', pattern: 'checker', second: 3 } })).toEqual(['2323']);
    expect(run(['....', '....'], 'pixels.plot', { points: [at(0, 0), at(1, 0), at(0, 1), at(1, 1)], index: 2, ink: { kind: 'dither', pattern: 'rows', second: 3 } })).toEqual(['22..', '33..']);
  });

  test('an ink index past the palette is refused', () => {
    const engine = pixelEngine(rowsArtwork(['....']));
    const failed = engine.execute(request([stepOf('pixels.paint', scope, { ...stroke, ink: { kind: 'onlyColour', index: 200 } })]));
    expect(errorOf(failed).code).toBe('INDEX_OUT_OF_RANGE');
  });

  test('erase with only colour removes one index', () => {
    expect(run(['1213'], 'pixels.erase', { points: [at(0, 0), at(3, 0)], ink: { kind: 'onlyColour', index: 1 } })).toEqual(['.2.3']);
  });
});

describe('shade inks follow the ramps of the palette', () => {
  const ramps = ['1234'];
  const shaded = (ink: Record<string, unknown>) => {
    const engine = pixelEngine(rampArtwork(ramps));
    okOf(engine.execute(request([stepOf('pixels.paint', scope, { points: [at(0, 0), at(1, 0), at(0, 0)], index: 1, ink })])));
    return rowsOf(engine);
  };

  test('moves each touched pixel once per stroke even when the path crosses itself', () => {
    expect(shaded({ kind: 'shade', ramp: 'Violet', direction: 'up' })).toEqual(['2334']);
  });

  test('auto ramp and lighten and darken use the ramp that holds the pixel', () => {
    expect(shaded({ kind: 'shade', direction: 'up', steps: 2 })).toEqual(['3434']);
    expect(shaded({ kind: 'lighten' })).toEqual(['2334']);
    expect(shaded({ kind: 'darken' })).toEqual(['1134']);
  });

  test('a named ramp that does not exist is refused', () => {
    const engine = pixelEngine(rampArtwork(ramps));
    const failed = engine.execute(request([stepOf('pixels.paint', scope, { points: [at(0, 0)], index: 1, ink: { kind: 'shade', ramp: 'Nope', direction: 'up' } })]));
    expect(errorOf(failed).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('pixels.plot', () => {
  test('sets the listed pixels without joining them', () => {
    expect(drawnOnEmpty(5, 1, 'pixels.plot', { points: [at(0, 0), at(4, 0)], index: 2 })).toEqual(['2...2']);
  });

  test('mirrors the dots through the symmetry', () => {
    expect(drawnOnEmpty(6, 1, 'pixels.plot', { points: [at(1, 0)], index: 2, symmetry: { x2: 6 } })).toEqual(['.2..2.']);
  });
});

describe('pixels.shape redesign options', () => {
  test('a filled rectangle can have a separate fill index', () => {
    expect(drawnOnEmpty(6, 5, 'pixels.shape', { shape: 'rect', from: at(0, 0), to: at(5, 4), index: 2, fillIndex: 3, filled: true })).toEqual([
      '222222',
      '233332',
      '233332',
      '233332',
      '222222',
    ]);
  });

  test('an ellipse takes a separate fill index too', () => {
    const rows = drawnOnEmpty(7, 5, 'pixels.shape', { shape: 'ellipse', from: at(0, 0), to: at(6, 4), index: 2, fillIndex: 3, filled: true });
    expect(rows[2]).toBe('2333332');
    expect(rows[0]?.includes('3')).toBe(false);
  });

  test('a rounded rectangle cuts its corners', () => {
    const rows = drawnOnEmpty(6, 6, 'pixels.shape', { shape: 'rect', from: at(0, 0), to: at(5, 5), index: 2, filled: true, radius: 2 });
    expect(rows[0]).toBe('.2222.');
    expect(rows[2]).toBe('222222');
    expect(rows).toEqual(rows.slice().reverse());
  });

  test('even steps draw runs of equal length', () => {
    expect(drawnOnEmpty(6, 2, 'pixels.shape', { shape: 'line', from: at(0, 0), to: at(5, 1), index: 2, evenSteps: true })).toEqual(['222...', '...222']);
    expect(drawnOnEmpty(6, 3, 'pixels.shape', { shape: 'line', from: at(0, 0), to: at(5, 2), index: 2, evenSteps: true })).toEqual(['22....', '..22..', '....22']);
  });

  test('curve and contour take a pixel perfect option', () => {
    const bent = { shape: 'curve', from: at(0, 4), control: at(3, 0), to: at(6, 4), index: 2 };
    const perfect = drawnOnEmpty(7, 5, 'pixels.shape', bent).join('');
    const loose = drawnOnEmpty(7, 5, 'pixels.shape', { ...bent, pixelPerfect: false }).join('');
    expect([...perfect].filter((cell) => cell === '2').length).toBeLessThanOrEqual([...loose].filter((cell) => cell === '2').length);
  });

  test('the ink applies to shapes', () => {
    expect(run(['1.1.1.'], 'pixels.shape', { shape: 'line', from: at(0, 0), to: at(5, 0), index: 2, ink: { kind: 'behind' } })).toEqual(['121212']);
  });
});

describe('pixels.fill redesign options', () => {
  test('fills under a vertical mirror from both seeds', () => {
    expect(run(['..#..', '..#..'].map((row) => row.replace('#', '1')), 'pixels.fill', { x: 0, y: 0, index: 2, symmetry: { x2: 5 } })).toEqual(['22122', '22122']);
  });

  test('fills under a 4 way turn around the crossing', () => {
    const rows = ['.1.1.', '11.11', '.....', '11.11', '.1.1.'];
    const out = run(rows, 'pixels.fill', { x: 0, y: 0, index: 2, symmetry: { x2: 5, y2: 5, mirrorX: false, mirrorY: false, turn4: true } });
    expect(out[0]?.[0]).toBe('2');
    expect(out[4]?.[4]).toBe('2');
    expect(out[0]?.[4]).toBe('2');
    expect(out[4]?.[0]).toBe('2');
  });

  test('an ink fills with a dither pattern', () => {
    expect(run(['....', '....'], 'pixels.fill', { x: 0, y: 0, index: 2, ink: { kind: 'dither', pattern: 'checker', second: 3 } })).toEqual(['2323', '3232']);
  });

  test('sample visible stops at an outline that sits on another layer', () => {
    const engine = pixelEngine(rowsArtwork(['....']));
    expect(errorOf(engine.execute(request([stepOf('pixels.fill', scope, { x: 0, y: 0, index: 2, sample: 'nope' })]))).code).toBe('INVALID_OPTION');
  });

  test('match ramp treats the colours of one ramp as one area', () => {
    const engine = pixelEngine(rampArtwork(['12.1']));
    okOf(engine.execute(request([stepOf('pixels.fill', scope, { x: 0, y: 0, index: 4, match: 'ramp' })])));
    expect(rowsOf(engine)).toEqual(['44.1']);
  });
});

describe('symmetry modes', () => {
  const plot = (symmetry: Record<string, unknown>, point = at(1, 0)) => drawnOnEmpty(6, 6, 'pixels.plot', { points: [point], index: 2, symmetry });

  test('a diagonal axis swaps x and y', () => {
    expect(plot({ x2: 6, y2: 6, mirrorX: false, mirrorY: false, diagonal: true })).toEqual(['.2....', '2.....', '......', '......', '......', '......']);
  });

  test('a 4 way turn puts a copy in every quarter', () => {
    const rows = plot({ x2: 6, y2: 6, mirrorX: false, mirrorY: false, turn4: true });
    expect(rows).toEqual(['.2....', '.....2', '2.....', '....2.', '......', '......'].map((_, row) => rows[row] ?? ''));
    expect(rows.join('').split('2').length - 1).toBe(4);
  });

  test('mirror plus diagonal gives the eight fold group', () => {
    const rows = plot({ x2: 6, y2: 6, diagonal: true });
    expect(rows.join('').split('2').length - 1).toBe(8);
  });

  test('stamps mirrored through the symmetry are flipped with it', () => {
    const patch = { width: 2, height: 1, pixels: Uint8Array.from([2, 3]) };
    const rows = drawnOnEmpty(6, 1, 'pixels.stamp', { patch, points: [at(1, 0)], anchor: at(0, 0), symmetry: { x2: 6 } });
    expect(rows).toEqual(['.2332.']);
  });
});

describe('pixels.stamp redesign options', () => {
  const patch = { width: 2, height: 1, pixels: Uint8Array.from([2, 3]) };

  test('flips and turns the patch', () => {
    expect(drawnOnEmpty(3, 2, 'pixels.stamp', { patch, points: [at(1, 0)], anchor: at(0, 0), flipX: true })).toEqual(['32.', '...']);
    expect(drawnOnEmpty(2, 2, 'pixels.stamp', { patch, points: [at(0, 0)], anchor: at(0, 0), turn: 90 })).toEqual(['2.', '3.']);
  });

  test('wraps across the edge', () => {
    expect(drawnOnEmpty(3, 1, 'pixels.stamp', { patch, points: [at(2, 0)], anchor: at(0, 0), wrap: { x: true } })).toEqual(['3.2']);
  });
});

describe('raster helpers', () => {
  test('evenLinePoints reaches both ends', () => {
    const points = evenLinePoints({ from: at(2, 2), to: at(9, 4) });
    expect(points[0]).toEqual(at(2, 2));
    expect(points.at(-1)).toEqual(at(9, 4));
  });

  test('roundedRect never leaves its box', () => {
    for (const span of roundedRect({ from: at(0, 0), to: at(9, 5) }, 8)) {
      expect(span.x0).toBeGreaterThanOrEqual(0);
      expect(span.x1).toBeLessThanOrEqual(9);
    }
  });
});
