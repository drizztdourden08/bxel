/* @layer tests @kind test */
import { borderMask, outlineMask, smoothMask } from '@bxel/raster';
import { describe, expect, test } from 'vitest';
import { buildArtwork } from './build-artwork';
import { celRows, errorOf, expectOneUndo, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { rowsArtwork, rowsIds } from './rows-artwork';
import { toRows } from './to-rows';
import { brand } from './brand';
import type { SpriteId } from '@bxel/document';

const rowsOfMask = (mask: { bits: Uint8Array; width: number; height: number }): string[] =>
  toRows({ pixels: mask.bits, width: mask.width, height: mask.height }).map((row) => row.replaceAll('1', '#'));

const BLOCK = maskFromRows(['......', '.###..', '.###..', '.###..', '......', '......']);
const scope = scopeOf([rowsIds.sprite]);

describe('selection shapes', () => {
  test('outline inside, outside with 4 and 8 neighbours', () => {
    expect(rowsOfMask(outlineMask(BLOCK, 'inside', 4))).toEqual(['......', '.###..', '.#.#..', '.###..', '......', '......']);
    expect(rowsOfMask(outlineMask(BLOCK, 'outside', 4))).toEqual(['.###..', '#...#.', '#...#.', '#...#.', '.###..', '......']);
    expect(rowsOfMask(outlineMask(BLOCK, 'outside', 8))).toEqual(['#####.', '#...#.', '#...#.', '#...#.', '#####.', '......']);
  });

  test('border is a ring centred on the edge', () => {
    const ring = borderMask(BLOCK, 1);
    expect(rowsOfMask(ring)[0]).toBe('#####.');
    expect(rowsOfMask(ring)[2]).toBe('##.##.');
  });

  test('smooth drops single pixel spurs and fills single pixel holes', () => {
    const spur = maskFromRows(['......', '.###..', '.###..', '.###.#', '......', '......']);
    expect(rowsOfMask(smoothMask(spur))[3]?.[5]).toBe('.');
    const hole = maskFromRows(['.....', '.###.', '.#.#.', '.###.', '.....']);
    expect(rowsOfMask(smoothMask(hole))[2]).toBe('.###.');
  });
});

describe('pixels.outline', () => {
  test('draws a one pixel line of the index as one undo step', () => {
    const engine = pixelEngine(rowsArtwork(['......', '......', '......', '......', '......', '......']));
    const original = engine.state().artwork;
    okOf(engine.execute(request([stepOf('pixels.outline', scope, { mask: BLOCK, side: 'inside', index: 3 })])));
    expect(celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel)).toEqual(['......', '.333..', '.3.3..', '.333..', '......', '......']);
    expectOneUndo(engine, original);
  });

  test('refuses a mask of the wrong size', () => {
    const engine = pixelEngine(rowsArtwork(['....', '....']));
    expect(errorOf(engine.execute(request([stepOf('pixels.outline', scope, { mask: BLOCK, index: 1 })]))).code).toBeDefined();
  });
});

describe('pixels.copy_region', () => {
  const art = () =>
    buildArtwork([
      { id: 'spr_000010', name: 'target', width: 5, height: 3, frames: ['frm_000012'], layers: [{ id: 'lay_000011', name: 'Body', cels: { frm_000012: 'cel_000014' } }], cels: { cel_000014: ['.....', '.....', '.....'] } },
      { id: 'spr_000020', name: 'source', width: 4, height: 2, frames: ['frm_000022'], layers: [{ id: 'lay_000021', name: 'Body', cels: { frm_000022: 'cel_000024' } }], cels: { cel_000024: ['12..', '.34.'] } },
    ]);
  const from = { sprite: 'spr_000020', frame: 'frm_000022', layer: 'lay_000021', rect: { x: 0, y: 0, width: 4, height: 2 } };

  test('copies the pixels across sprites and keeps transparent source pixels out', () => {
    const engine = pixelEngine(art());
    okOf(engine.execute(request([stepOf('pixels.copy_region', scope, { from, at: { x: 1, y: 1 } })])));
    expect(celRows(engine.state().artwork, brand<SpriteId>('spr_000010'), rowsIds.cel)).toEqual(['.....', '.12..', '..34.']);
  });

  test('a source mask limits what is copied', () => {
    const engine = pixelEngine(art());
    const mask = maskFromRows(['#...', '..#.']);
    okOf(engine.execute(request([stepOf('pixels.copy_region', scope, { from: { ...from, mask }, at: { x: 0, y: 0 } })])));
    expect(celRows(engine.state().artwork, brand<SpriteId>('spr_000010'), rowsIds.cel)).toEqual(['1....', '..4..', '.....']);
  });

  test('refuses a source layer that does not exist', () => {
    const engine = pixelEngine(art());
    expect(errorOf(engine.execute(request([stepOf('pixels.copy_region', scope, { from: { ...from, layer: 'lay_999999' }, at: { x: 0, y: 0 } })]))).code).toBe('TARGET_NOT_FOUND');
  });
});
