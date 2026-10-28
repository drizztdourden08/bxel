/* @layer renderer-app @kind test */
import type { CellFlags, Tile } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import type { TileStamp } from '../../src/stores/tilemap-store.type';
import { orientStamp } from '../../src/tilemap/orient-stamp';
import { scatterKey } from '../../src/tilemap/scatter-key';
import { toggleScatter } from '../../src/views/TilesetPanel/behavior/toggle-scatter';
import { tracePixels } from '../../src/views/TilesetPanel/behavior/trace-pixels';
import { tilesetOf } from './tile-fixture';

const BLOCK: TileStamp = { columns: 3, rows: 2, keys: [1, 2, 3, 4, 5, 6] };

const flags = (set: Partial<CellFlags>): CellFlags => ({ flipX: false, flipY: false, diagonal: false, ...set });

describe('orienting a stamp as a block', () => {
  it('mirrors the block with flip X and flip Y', () => {
    expect(orientStamp(BLOCK, flags({ flipX: true }))).toEqual({ columns: 3, rows: 2, keys: [3, 2, 1, 6, 5, 4] });
    expect(orientStamp(BLOCK, flags({ flipY: true }))).toEqual({ columns: 3, rows: 2, keys: [4, 5, 6, 1, 2, 3] });
  });

  it('turns the block and swaps its size', () => {
    const turned = orientStamp(BLOCK, flags({ diagonal: true, flipX: true }));
    expect(turned).toEqual({ columns: 2, rows: 3, keys: [4, 1, 5, 2, 6, 3] });
  });

  it('keeps a stamp with no flags and a scatter set as they are', () => {
    expect(orientStamp(BLOCK, flags({}))).toBe(BLOCK);
    const scatter = { columns: 2, rows: 1, keys: [1, 2], scatter: true };
    expect(orientStamp(scatter, flags({ flipX: true }))).toBe(scatter);
  });
});

describe('scatter sets', () => {
  const set = (weights: readonly (number | undefined)[]) => ({
    ...tilesetOf(weights.length),
    tiles: tilesetOf(weights.length).tiles.map((tile, at): Tile => (weights[at] === undefined ? tile : { ...tile, probability: weights[at] })),
  });
  const stamp: TileStamp = { columns: 3, rows: 1, keys: [1, 2, 3], scatter: true };

  it('picks by weight and never picks probability 0', () => {
    const tileset = set([0, 1, 3]);
    const picks = Array.from({ length: 100 }, (_unused, at) => scatterKey(stamp, tileset, at / 100));
    expect(picks).not.toContain(1);
    expect(new Set(picks)).toEqual(new Set([2, 3]));
    expect(picks.filter((key) => key === 3).length).toBeGreaterThan(picks.filter((key) => key === 2).length);
  });

  it('picks nothing when every tile has probability 0', () => {
    expect(scatterKey(stamp, set([0, 0, 0]), 0.5)).toBe(0);
  });

  it('toggles single tiles in and out of the set', () => {
    const one = toggleScatter({ columns: 1, rows: 1, keys: [4] }, 6);
    expect(one).toEqual({ columns: 2, rows: 1, keys: [4, 6], scatter: true });
    expect(toggleScatter(one, 4)).toEqual({ columns: 1, rows: 1, keys: [6] });
    expect(toggleScatter({ columns: 1, rows: 1, keys: [6] }, 6)).toEqual({ columns: 1, rows: 1, keys: [0] });
  });
});

describe('tracing pixels into a collision shape', () => {
  it('makes a box of a filled tile and a polygon of a diagonal one', () => {
    expect(tracePixels(Uint8Array.from([1, 1, 1, 1]), 2)).toEqual({ kind: 'rect', x: 0, y: 0, width: 2, height: 2 });
    const shape = tracePixels(Uint8Array.from([0, 0, 1, 0, 1, 1, 1, 1, 1]), 3);
    expect(shape?.kind).toBe('polygon');
    const points = shape?.kind === 'polygon' ? shape.points : [];
    expect(points.length).toBeGreaterThanOrEqual(3);
    expect(points.every((point) => point.x >= 0 && point.x <= 3 && point.y >= 0 && point.y <= 3)).toBe(true);
  });

  it('finds nothing in an empty tile', () => {
    expect(tracePixels(new Uint8Array(4), 2)).toBeNull();
  });
});
