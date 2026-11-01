/* @layer renderer-app @kind test */
import type { TerrainSet, Tile } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { shapeCovers } from '../../src/assistant/tools/shape-covers';
import { choiceOptions } from '../../src/views/TilesetPanel/behavior/choice-options';
import { chipOf } from '../../src/views/TilesetPanel/behavior/chip-of';
import { contextSet } from '../../src/views/TilesetPanel/behavior/context-set';
import { terrainContext } from '../../src/views/TilesetPanel/behavior/terrain-context';
import { gridStep } from '../../src/views/TilesetPanel/behavior/grid-step';
import { tileMatches } from '../../src/views/TilesetPanel/behavior/tile-matches';
import { tilesetOf } from './tile-fixture';

const tile = (extra: Partial<Tile>): Tile => ({ id: 'til_1' as Tile['id'], key: 1, spriteId: 'spr_1' as Tile['spriteId'], ...extra });

const base = (extra: Partial<Tile> = {}, uses = 0) => ({ tile: tile(extra), name: 'grass', uses, terrainSlot: null });

describe('K1 searching and filtering tiles', { tags: ['critical'] }, () => {
  it('matches key, name, type and field values', () => {
    const wall = base({ key: 12, type: 'wall', data: { surface: 'stone' } });
    expect(tileMatches(wall, { search: '12', filters: [], choices: [], fields: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'GRA', filters: [], choices: [], fields: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'type:wall', filters: [], choices: [], fields: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'type:water', filters: [], choices: [], fields: [] })).toBe(false);
    expect(tileMatches(wall, { search: 'stone wall', filters: [], choices: [], fields: [] })).toBe(true);
    expect(tileMatches(wall, { search: 'lava', filters: [], choices: [], fields: [] })).toBe(false);
  });

  it('filters used and unused tiles and keeps the others for the layout holes', () => {
    expect(tileMatches(base({}, 3), { search: '', filters: ['unused'], choices: [], fields: [] })).toBe(false);
    expect(tileMatches(base({}, 0), { search: '', filters: ['unused'], choices: [], fields: [] })).toBe(true);
    expect(tileMatches(base({}, 3), { search: '', filters: ['used', 'collision'], choices: [], fields: [] })).toBe(false);
    expect(tileMatches(base({ shapes: [{ kind: 'full', layer: 'solid' }] }, 3), { search: '', filters: ['used', 'collision'], choices: [], fields: [] })).toBe(true);
  });
});

describe('K1 filtering tiles by choice values', { tags: ['critical'] }, () => {
  const fields = [{ name: 'surface', kind: 'choice' as const, default: 'stone', choices: ['stone', 'water', 'sand'] }];
  const query = (choices: readonly { field: string; value: string }[]) => ({ search: '', filters: [], choices, fields });

  it('matches the stored value and falls back to the field default', () => {
    const water = base({ data: { surface: 'water' } });
    const plain = base({});
    expect(tileMatches(water, query([{ field: 'surface', value: 'water' }]))).toBe(true);
    expect(tileMatches(plain, query([{ field: 'surface', value: 'water' }]))).toBe(false);
    expect(tileMatches(plain, query([{ field: 'surface', value: 'stone' }]))).toBe(true);
  });

  it('takes any of the values chosen for one field', () => {
    const sand = base({ data: { surface: 'sand' } });
    expect(tileMatches(sand, query([{ field: 'surface', value: 'water' }, { field: 'surface', value: 'sand' }]))).toBe(true);
  });

  it('needs every field that has a chosen value', () => {
    const both = [...fields, { name: 'mood', kind: 'choice' as const, default: 'calm', choices: ['calm', 'wild'] }];
    const tileA = base({ data: { surface: 'water', mood: 'wild' } });
    const chosen = [{ field: 'surface', value: 'water' }, { field: 'mood', value: 'calm' }];
    expect(tileMatches(tileA, { search: '', filters: [], choices: chosen, fields: both })).toBe(false);
  });

  it('lists a chip for each value of each choice field', () => {
    const set = { ...tilesetOf(1), fields: [...fields, { name: 'hp', kind: 'int' as const, default: 0 }] };
    expect(choiceOptions(set).map((option) => option.label)).toEqual(['surface: stone', 'surface: water', 'surface: sand']);
  });
});

describe('K1 the 3 by 3 terrain context of a tile', { tags: ['critical'] }, () => {
  const slots = Array.from({ length: 16 }, (): { key: number; weight: number }[] => []);
  slots[0] = [{ key: 1, weight: 1 }];
  slots[1] = [{ key: 2, weight: 1 }];
  slots[15] = [{ key: 9, weight: 1 }];
  const set: TerrainSet = { id: 'set_a', name: 'Grass', kind: 'blob16', slots };

  it('fills the sides the tile marks with the interior tile and leaves the rest empty', () => {
    expect(terrainContext(set, 2)).toEqual([null, 9, null, null, 2, null, null, null, null]);
  });

  it('shows a tile with no marked sides alone', () => {
    expect(terrainContext(set, 1)).toEqual([null, null, null, null, 1, null, null, null, null]);
  });

  it('repeats a tile that is in no set, so the seams show', () => {
    expect(terrainContext(set, 5)).toEqual(Array.from({ length: 9 }, () => 5));
    expect(terrainContext(undefined, 5)).toEqual(Array.from({ length: 9 }, () => 5));
  });

  it('prefers the active set among those that hold the tile', () => {
    const other: TerrainSet = { ...set, id: 'set_b' };
    expect(contextSet([set, other], 'set_b', 2)?.id).toBe('set_b');
    expect(contextSet([set, other], null, 2)?.id).toBe('set_a');
    expect(contextSet([set], null, 5)).toBeUndefined();
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
