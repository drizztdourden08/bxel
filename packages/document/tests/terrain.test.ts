/* @layer core @kind test */
import { BLOB47_MASKS, slotMask, terrainIndex } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { tilesetReport } from './tileset-file';
import { applySteps, buildWorld, cellsOf, checkOneUndoStep, failure, onGround, step, tilesetOf } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const SLOTS_16 = Array.from({ length: 16 }, (_, at) => at + 1);

const withTiles = (): World => {
  const world = buildWorld();
  const more = Array.from({ length: 14 }, () => step('tile.add', { tileset: world.tileset }));
  applySteps(world.engine, more);
  return world;
};

const rules16 = (world: World) => step('tileset.terrain', { tileset: world.tileset, rules: { kind: 'blob16', keys: SLOTS_16 } });

const terrain = (world: World, mode: 'paint' | 'erase', cells: readonly { x: number; y: number }[]) =>
  step('map.terrain', onGround(world, { mode, cells }));

describe('terrain neighbour rules', () => {
  it('lists the 47 blob masks, every one reduced, and finds each by its index', () => {
    expect(BLOB47_MASKS).toHaveLength(47);
    expect(new Set(BLOB47_MASKS).size).toBe(47);
    BLOB47_MASKS.forEach((mask, at) => expect(terrainIndex('blob47', mask)).toBe(at));
  });

  it('folds a corner into nothing when one of its edges is missing', () => {
    const north = 1;
    const northEast = 2;
    expect(terrainIndex('blob47', north | northEast)).toBe(terrainIndex('blob47', north));
    expect(terrainIndex('blob47', 255)).toBe(46);
  });

  it('reads the four edges for the sixteen tile set and round trips the slot masks', () => {
    expect(terrainIndex('blob16', 0)).toBe(0);
    expect(terrainIndex('blob16', 1 | 4)).toBe(1 | 2);
    for (let at = 0; at < 16; at += 1) expect(terrainIndex('blob16', slotMask('blob16', at))).toBe(at);
  });
});

describe('tileset.terrain', () => {
  it('sets the rule set as one undo step and clears it', () => {
    const world = withTiles();
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [rules16(world)]));
    expect(tilesetOf(world.engine).terrain).toEqual({ kind: 'blob16', keys: SLOTS_16 });
    applySteps(world.engine, [step('tileset.terrain', { tileset: world.tileset, rules: null })]);
    expect('terrain' in tilesetOf(world.engine)).toBe(false);
  });

  it('refuses the wrong slot count and a tile the tileset does not have', () => {
    const world = withTiles();
    const short = { kind: 'blob16', keys: [1, 2, 3] };
    expect(failure(world.engine, [step('tileset.terrain', { tileset: world.tileset, rules: short })]).code).toBe('INVALID_OPTION');
    const lost = { kind: 'blob16', keys: [...SLOTS_16.slice(0, 15), 99] };
    expect(failure(world.engine, [step('tileset.terrain', { tileset: world.tileset, rules: lost })]).code).toBe('INVALID_OPTION');
  });

  it('empties the slot of a deleted tile', () => {
    const world = withTiles();
    applySteps(world.engine, [rules16(world)]);
    applySteps(world.engine, [step('tile.delete', { tileset: world.tileset, key: 5 })]);
    expect(tilesetOf(world.engine).terrain?.keys[4]).toBe(0);
  });

  it('is saved in the tileset file', () => {
    const world = withTiles();
    applySteps(world.engine, [rules16(world)]);
    const report = tilesetReport(world.engine);
    expect(report.outcome).toBe('ok');
    expect(report.slice?.artwork.tilesets?.[0]?.terrain).toEqual({ kind: 'blob16', keys: SLOTS_16 });
  });
});

describe('map.terrain', () => {
  const ready = (): World => {
    const world = withTiles();
    applySteps(world.engine, [rules16(world)]);
    return world;
  };

  it('picks each tile from its neighbours and updates the neighbours it joins', () => {
    const world = ready();
    applySteps(world.engine, [terrain(world, 'paint', [{ x: 1, y: 1 }])]);
    expect(cellsOf(world.engine)[5]).toBe(1);
    applySteps(world.engine, [terrain(world, 'paint', [{ x: 2, y: 1 }])]);
    const cells = cellsOf(world.engine);
    expect(cells[5]).toBe(1 + 2);
    expect(cells[6]).toBe(1 + 8);
  });

  it('closes a ring of four into corner pieces and opens it again on erase', () => {
    const world = ready();
    const block = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }];
    applySteps(world.engine, [terrain(world, 'paint', block)]);
    const cells = cellsOf(world.engine);
    expect([cells[5], cells[6], cells[9], cells[10]]).toEqual([1 + 2 + 4, 1 + 4 + 8, 1 + 1 + 2, 1 + 1 + 8]);
    applySteps(world.engine, [terrain(world, 'erase', [{ x: 2, y: 2 }])]);
    const after = cellsOf(world.engine);
    expect(after[10]).toBe(0);
    expect([after[6], after[9]]).toEqual([1 + 8, 1 + 1]);
  });

  it('is one undo step', () => {
    const world = ready();
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [terrain(world, 'paint', [{ x: 0, y: 0 }, { x: 1, y: 0 }])]));
  });

  it('refuses a tileset without rules and a locked layer', () => {
    const world = ready();
    applySteps(world.engine, [step('map.layer.update', { tilemap: world.map, layer: { by: 'name', name: 'Ground' }, locked: true })]);
    expect(failure(world.engine, [terrain(world, 'paint', [{ x: 0, y: 0 }])]).code).toBe('LAYER_LOCKED');
    const bare = buildWorld();
    expect(failure(bare.engine, [terrain(bare, 'paint', [{ x: 0, y: 0 }])]).code).toBe('INVALID_OPTION');
  });
});
