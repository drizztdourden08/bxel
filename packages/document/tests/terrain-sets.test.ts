/* @layer core @kind test */
import { pickVariant, terrainIndex, terrainSetsOf, slotMask } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { fixedClock, heartPreview } from './native-fixture';
import { applySteps, buildWorld, cellsOf, checkOneUndoStep, failure, onGround, step, tilesetOf } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const withTiles = (): World => {
  const world = buildWorld();
  applySteps(world.engine, Array.from({ length: 14 }, () => step('tile.add', { tileset: world.tileset })));
  return world;
};

const edgeSet = (variants: Record<number, readonly object[]> = {}) => ({
  id: 'edge',
  name: 'Edge',
  kind: 'blob16',
  slots: Array.from({ length: 16 }, (_unused, at) => variants[at] ?? [{ key: at + 1, weight: 1 }]),
});

const sets = (world: World, list: readonly object[] | null) => step('tileset.terrain_sets', { tileset: world.tileset, sets: list });

const paint = (world: World, cells: readonly { x: number; y: number }[], extra: object = {}) => step('map.terrain', onGround(world, { mode: 'paint', cells, ...extra }));

describe('K1 corner 16 sets', { tags: ['critical'] }, () => {
  it('reads a corner only when both of its sides are filled and round trips the slot masks', () => {
    expect(terrainIndex('corner16', 2)).toBe(0);
    expect(terrainIndex('corner16', 1 | 4 | 2)).toBe(1);
    for (let at = 0; at < 16; at += 1) expect(terrainIndex('corner16', slotMask('corner16', at) | 85)).toBe(at | terrainIndex('corner16', 85));
    for (let at = 0; at < 16; at += 1) expect(slotMask('corner16', at) & 85).toBe(0);
  });
});

describe('K1 tileset.terrain_sets', { tags: ['critical'] }, () => {
  it('sets a list of sets as one undo step, drops the old single rule set and clears', () => {
    const world = withTiles();
    applySteps(world.engine, [step('tileset.terrain', { tileset: world.tileset, rules: { kind: 'blob16', keys: Array.from({ length: 16 }, (_unused, at) => at + 1) } })]);
    expect(terrainSetsOf(tilesetOf(world.engine))[0]?.slots[3]).toEqual([{ key: 4, weight: 1 }]);
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [sets(world, [edgeSet()])]));
    expect('terrain' in tilesetOf(world.engine)).toBe(false);
    applySteps(world.engine, [sets(world, null)]);
    expect(terrainSetsOf(tilesetOf(world.engine))).toEqual([]);
  });

  it('refuses a wrong slot count, a missing tile and repeated names', () => {
    const world = withTiles();
    expect(failure(world.engine, [sets(world, [{ ...edgeSet(), slots: [[]] }])]).code).toBe('INVALID_OPTION');
    expect(failure(world.engine, [sets(world, [edgeSet({ 0: [{ key: 99, weight: 1 }] })])]).code).toBe('INVALID_OPTION');
    expect(failure(world.engine, [sets(world, [edgeSet(), { ...edgeSet(), id: 'other' }])]).code).toBe('INVALID_OPTION');
  });

  it('survives a save and drops the variants of a deleted tile', () => {
    const world = withTiles();
    applySteps(world.engine, [sets(world, [edgeSet({ 0: [{ key: 1, weight: 2 }, { key: 2, weight: 1, flipX: true }] })])]);
    const report = decodeArtwork(encodeArtwork(world.engine.state(), heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    expect(report.artwork?.tilesets[0]?.terrainSets?.[0]?.slots[0]).toEqual([{ key: 1, weight: 2 }, { key: 2, weight: 1, flipX: true }]);
    applySteps(world.engine, [step('tile.delete', { tileset: world.tileset, key: 2 })]);
    expect(tilesetOf(world.engine).terrainSets?.[0]?.slots[0]).toEqual([{ key: 1, weight: 2 }]);
  });
});

describe('K1 map.terrain with sets', { tags: ['critical'] }, () => {
  it('picks the set by id or name and refuses an unknown one', () => {
    const world = withTiles();
    applySteps(world.engine, [sets(world, [edgeSet(), { ...edgeSet(), id: 'second', name: 'Second', slots: edgeSet().slots.map((slot, at) => (at === 0 ? [{ key: 9, weight: 1 }] : slot)) }])]);
    applySteps(world.engine, [paint(world, [{ x: 0, y: 0 }], { set: 'second' })]);
    expect(cellsOf(world.engine)[0]).toBe(9);
    expect(failure(world.engine, [paint(world, [{ x: 3, y: 0 }], { set: 'nothing' })]).code).toBe('INVALID_OPTION');
  });

  it('chooses variants by weight and never picks weight 0', () => {
    const variants = [{ key: 1, weight: 0 }, { key: 2, weight: 1 }, { key: 3, weight: 3 }];
    const picks = Array.from({ length: 400 }, (_unused, at) => pickVariant(variants, at)?.key);
    expect(picks).not.toContain(1);
    expect(picks.filter((key) => key === 3).length).toBeGreaterThan(picks.filter((key) => key === 2).length);
    expect(pickVariant([{ key: 5, weight: 0 }], 3)?.key).toBe(5);
  });

  it('writes the turn of a variant into the cell', () => {
    const world = withTiles();
    applySteps(world.engine, [sets(world, [edgeSet({ 0: [{ key: 3, weight: 1, flipX: true }] })])]);
    applySteps(world.engine, [paint(world, [{ x: 0, y: 0 }])]);
    expect(cellsOf(world.engine)[0]).toBe((3 | 0x80000000) >>> 0);
  });
});
