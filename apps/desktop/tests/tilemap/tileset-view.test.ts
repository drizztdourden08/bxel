/* @layer renderer-app @kind test */
import type { Tile } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { shapeCovers } from '../../src/assistant/tools/shape-covers';
import { chipOf } from '../../src/views/TilesetPanel/behavior/chip-of';
import { gridStep } from '../../src/views/TilesetPanel/behavior/grid-step';
import { tileMatches } from '../../src/views/TilesetPanel/behavior/tile-matches';
import { tilesetOf } from './tile-fixture';

const tile = (extra: Partial<Tile>): Tile => ({ id: 'til_1' as Tile['id'], key: 1, spriteId: 'spr_1' as Tile['spriteId'], ...extra });

const base = (extra: Partial<Tile> = {}, uses = 0) => ({ tile: tile(extra), name: 'grass', uses, terrainSlot: null });

describe('K1 searching and filtering tiles', { tags: ['critical'] }, () => {
  it('matches key, name, type and field values', () => {
    const wall = base({ key: 12, type: 'wall', data: { surface: 'stone' } });
    expect(tileMatches(wall, { search: '12', filters: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'GRA', filters: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'type:wall', filters: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'type:water', filters: [] })).toBe(false);
    expect(tileMatches(wall, { search: 'stone wall', filters: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'lava', filters: [] })).toBe(false);
  });

  it('filters used and unused tiles and keeps the others for the layout holes', () => {
    expect(tileMatches(base({}, 3), { search: '', filters: ['unused'] })).toBe(false);
    expect(tileMatches(base({}, 0), { search: '', filters: ['unused'] })).toBe(true);
    expect(tileMatches(base({}, 3), { search: '', filters: ['used', 'collision'] })).toBe(false);
    expect(tileMatches(base({ shapes: [{ kind: 'full', layer: 'solid' }] }, 3), { search: '', filters: ['used', 'collision'] })).toBe(true);
  });
});

describe('K1 moving through the grid by keys', { tags: ['critical'] }, () => {
  it('moves by cell and row, stops at the row edges and clamps to the grid', () => {
    expect(gridStep('ArrowRight', 0, 3, 9)).toBe(1);
    expect(gridStep('ArrowRight', 2, 3, 9)).toBeNull();
    expect(gridStep('ArrowLeft', 3, 3, 9)).toBeNull();
    expect(gridStep('ArrowDown', 7, 3, 9)).toBe(8);
    expect(gridStep('ArrowUp', 1, 3, 9)).toBe(0);
    expect(gridStep('End', 3, 3, 9)).toBe(5);
    expect(gridStep('Home', 5, 3, 9)).toBe(3);
    expect(gridStep('x', 0, 3, 9)).toBeNull();
  });
});

describe('K1 data chips', { tags: ['critical'] }, () => {
  it('shows the first letter of a choice and cycles the colour by its position', () => {
    const set = { ...tilesetOf(1), fields: [{ name: 'surface', kind: 'choice' as const, default: 'stone', choices: ['stone', 'water'] }] };
    expect(chipOf(set, tile({ data: { surface: 'water' } }))).toEqual({ letter: 'W', tone: 1 });
    expect(chipOf(set, tile({}))).toBeNull();
  });
});

describe('K1 covering pixels with a collision shape', { tags: ['critical'] }, () => {
  const size = { width: 4, height: 4 };

  it('covers a box and a whole tile', () => {
    const box = { kind: 'rect', x: 0, y: 2, width: 4, height: 2, layer: 'solid' } as const;
    expect(shapeCovers(box, size, { x: 1, y: 3 })).toBe(true);
    expect(shapeCovers(box, size, { x: 1, y: 0 })).toBe(false);
    expect(shapeCovers({ kind: 'full', layer: 'solid' }, size, { x: 3, y: 0 })).toBe(true);
  });

  it('covers the inside of a triangle only', () => {
    const triangle = { kind: 'polygon', points: [{ x: 0, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 0 }], layer: 'solid' } as const;
    expect(shapeCovers(triangle, size, { x: 3, y: 3 })).toBe(true);
    expect(shapeCovers(triangle, size, { x: 0, y: 0 })).toBe(false);
  });
});
