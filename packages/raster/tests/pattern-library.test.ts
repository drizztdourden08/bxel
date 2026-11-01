/* @layer tests @kind test */
import { encodeBrushPixels } from '@bxel/document';
import type { Artwork, BrushId } from '@bxel/document';
import { ditherOn, PATTERN_IDS } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { errorOf, pixelEngine, request, stepOf } from './advanced-kit';
import { brand } from './brand';
import { at, rowsAfter, scope } from './draw-kit';
import { rampArtwork } from './ramp-artwork';
import { rowsArtwork } from './rows-artwork';

const brushId = brand<BrushId>('brs_000001');

const withMask = (artwork: Artwork, width: number, height: number, pixels: readonly number[]): Artwork => ({
  ...artwork,
  brushes: [{ id: brushId, name: 'Mask', width, height, pixels: encodeBrushPixels(Uint8Array.from(pixels)) }],
});

const cells = (pattern: (typeof PATTERN_IDS)[number], size: number): string[] =>
  Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => (ditherOn(pattern, 8, x, y) ? '#' : '.')).join(''));

describe('K1 the pattern library', { tags: ['critical'] }, () => {
  test('every built-in tile repeats from the canvas origin', () => {
    expect(cells('checker', 4)).toEqual(['#.#.', '.#.#', '#.#.', '.#.#']);
    expect(cells('rows', 4)).toEqual(['####', '....', '####', '....']);
    expect(cells('columns', 4)).toEqual(['#.#.', '#.#.', '#.#.', '#.#.']);
    expect(cells('dots', 4)).toEqual(['#.#.', '....', '#.#.', '....']);
    expect(cells('diagonal', 6)).toEqual(['#..#..', '.#..#.', '..#..#', '#..#..', '.#..#.', '..#..#']);
    expect(cells('sparse', 8)).toEqual(['#...#...', '........', '..#...#.', '........', '#...#...', '........', '..#...#.', '........']);
  });

  test('a tile continues into negative cells without a seam', () => {
    expect(ditherOn('diagonal', 8, -1, -1)).toBe(true);
    expect(ditherOn('diagonal', 8, -1, 0)).toBe(false);
    expect(ditherOn('sparse', 8, -4, -4)).toBe(true);
  });

  test('bayer turns on one more cell per level', () => {
    const on = (level: number): number => Array.from({ length: 16 }, (_, cell) => ditherOn('bayer', level, cell % 4, Math.floor(cell / 4))).filter(Boolean).length;
    expect([1, 8, 15].map(on)).toEqual([1, 8, 15]);
  });

  test('the dither ink takes any library pattern', () => {
    expect(rowsAfter(rowsArtwork(['......']), 'pixels.paint', { points: [at(0, 0), at(5, 0)], index: 2, ink: { kind: 'dither', pattern: 'diagonal', second: 3 } })).toEqual(['233233']);
  });

  test('a saved brush works as a custom two colour mask for the dither ink', () => {
    const art = withMask(rowsArtwork(['.....']), 3, 1, [1, 0, 0]);
    const rows = rowsAfter(art, 'pixels.paint', { points: [at(0, 0), at(4, 0)], index: 2, ink: { kind: 'dither', pattern: 'checker', second: 3, brushId } });
    expect(rows).toEqual(['23323']);
  });

  test('the origin of a custom mask shifts it', () => {
    const art = withMask(rowsArtwork(['.....']), 3, 1, [1, 0, 0]);
    const rows = rowsAfter(art, 'pixels.paint', { points: [at(0, 0), at(4, 0)], index: 2, ink: { kind: 'dither', pattern: 'checker', second: 3, brushId, originX: 1 } });
    expect(rows).toEqual(['32332']);
  });

  test('a dither fill follows a custom mask too', () => {
    const art = withMask(rowsArtwork(['....', '....']), 2, 2, [1, 0, 0, 1]);
    expect(rowsAfter(art, 'pixels.fill', { x: 0, y: 0, index: 2, ink: { kind: 'dither', pattern: 'checker', second: 3, brushId } })).toEqual(['2323', '3232']);
  });

  test('a dither ink that names a brush the artwork lacks is refused', () => {
    const failed = pixelEngine(rowsArtwork(['....'])).execute(
      request([stepOf('pixels.paint', scope, { points: [at(0, 0)], index: 2, ink: { kind: 'dither', pattern: 'checker', second: 3, brushId: 'brs_000099' } })]),
    );
    expect(errorOf(failed).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('K1 gradient dither patterns', { tags: ['critical'] }, () => {
  const ramp = { ramp: 'Violet', last: 1, mode: 'dither', line: { from: at(0, 0), to: at(11, 0) } };
  const gradient = (artwork: Artwork, extra: Record<string, unknown>): string[] => rowsAfter(artwork, 'pixels.gradient', { ...ramp, ...extra });

  test('the dots pattern mixes the two colours between the ends', () => {
    const row = gradient(rampArtwork(['............']), { pattern: 'dots' })[0] ?? '';
    expect(row.startsWith('1')).toBe(true);
    expect(row.endsWith('2')).toBe(true);
    expect(row).toMatch(/^1+[12]+2+$/);
  });

  test('a saved brush drives the gradient like the same built-in tile', () => {
    const art = withMask(rampArtwork(['............']), 2, 1, [1, 0]);
    expect(gradient(art, { brushId })).toEqual(gradient(rampArtwork(['............']), { pattern: 'columns' }));
  });

  test('a wrapped tile that does not divide the canvas falls back to bands', () => {
    const odd = '..........';
    expect(gradient(rampArtwork([odd]), { pattern: 'diagonal', wrap: { x: true } })).toEqual(gradient(rampArtwork([odd]), { mode: 'bands' }));
  });

  test('a wrapped tile that divides the canvas keeps the pattern', () => {
    const wide = '............';
    expect(gradient(rampArtwork([wide]), { pattern: 'sparse', wrap: { x: true } })).toEqual(gradient(rampArtwork([wide]), { pattern: 'sparse' }));
    expect(gradient(rampArtwork([wide]), { pattern: 'sparse', wrap: { x: true } })).not.toEqual(gradient(rampArtwork([wide]), { mode: 'bands' }));
  });
});
