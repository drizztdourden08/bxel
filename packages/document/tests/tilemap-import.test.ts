/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { applySteps, buildWorld, checkOneUndoStep, failure, step } from './tile-engine';

const FLIP_X = 0x80000000;

const importStep = (world: ReturnType<typeof buildWorld>, options: Record<string, unknown> = {}) =>
  step('tilemap.import', {
    name: 'imported',
    tileset: world.tileset,
    columns: 2,
    rows: 2,
    layers: [
      { name: 'Ground', cells: Uint32Array.from([1, 2, 0, (FLIP_X | 2) >>> 0]) },
      { name: 'Top', visible: false, locked: true, cells: new Uint32Array(4) },
    ],
    ...options,
  });

describe('tilemap.import', () => {
  it('creates a map with the given layers, flags and visibility in one step', () => {
    const world = buildWorld();
    const revision = world.engine.state().revision;
    applySteps(world.engine, [importStep(world)]);
    expect(world.engine.state().revision).toBe(revision + 1);
    const made = world.engine.state().artwork.tilemaps.find((map) => map.name === 'imported');
    expect(made?.layers.map((layer) => [layer.name, layer.visible, layer.locked])).toEqual([
      ['Ground', true, false],
      ['Top', false, true],
    ]);
    expect(Array.from(made?.layers[0]?.cells ?? [])).toEqual([1, 2, 0, (FLIP_X | 2) >>> 0]);
  });

  it('undoes and redoes as one step', () => {
    const world = buildWorld();
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [importStep(world)]));
  });

  it('refuses a cell that names a tile the tileset does not have', () => {
    const world = buildWorld();
    const layers = [{ name: 'Ground', cells: Uint32Array.from([1, 9, 0, 0]) }];
    expect(failure(world.engine, [importStep(world, { layers })]).code).toBe('REFERENCE_BROKEN');
  });

  it('refuses a layer of the wrong size, a reserved bit, duplicate names and a taken name', () => {
    const world = buildWorld();
    const wrong = [{ name: 'Ground', cells: new Uint32Array(3) }];
    expect(failure(world.engine, [importStep(world, { layers: wrong })]).code).toBe('INVALID_OPTION');
    const reserved = [{ name: 'Ground', cells: Uint32Array.from([0x10000001, 0, 0, 0]) }];
    expect(failure(world.engine, [importStep(world, { layers: reserved })]).code).toBe('INVALID_OPTION');
    const twice = [
      { name: 'Same', cells: new Uint32Array(4) },
      { name: 'same', cells: new Uint32Array(4) },
    ];
    expect(failure(world.engine, [importStep(world, { layers: twice })]).code).toBe('NAME_TAKEN');
    expect(failure(world.engine, [importStep(world, { name: 'level' })]).code).toBe('NAME_TAKEN');
  });
});
