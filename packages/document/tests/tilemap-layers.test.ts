/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { applySteps, buildWorld, cellsOf, failure, layerOf, mapOf, onGround, step } from './tile-engine';

const undo = (engine: ReturnType<typeof buildWorld>['engine']) =>
  engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });

describe('tilemap.create, update and delete', () => {
  it('creates a map with one empty layer in one undo step', () => {
    const world = buildWorld();
    const { engine } = world;
    expect(mapOf(engine)).toMatchObject({ name: 'level', columns: 4, rows: 3, tilesetId: world.tileset });
    expect(cellsOf(engine)).toEqual(new Array(12).fill(0));
    expect(mapOf(engine).layers).toHaveLength(1);
    expect(undo(engine).ok).toBe(true);
    expect(engine.state().artwork.tilemaps).toEqual([]);
  });

  it('names the first layer Layer 1 by default', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('tilemap.create', { name: 'second', tileset: world.tileset, columns: 2, rows: 2 })]);
    expect(world.engine.state().artwork.tilemaps[1]?.layers[0]?.name).toBe('Layer 1');
  });

  it('rejects a taken name, a bad size and an unknown tileset', () => {
    const world = buildWorld();
    const { engine, tileset } = world;
    expect(failure(engine, [step('tilemap.create', { name: 'LEVEL', tileset, columns: 2, rows: 2 })]).code).toBe('NAME_TAKEN');
    expect(failure(engine, [step('tilemap.create', { name: 'a', tileset, columns: 0, rows: 2 })]).code).toBe('SIZE_OUT_OF_RANGE');
    const huge = { name: 'a', tileset, columns: 8000, rows: 8000 };
    expect(failure(engine, [step('tilemap.create', huge)]).code).toBe('SIZE_OUT_OF_RANGE');
    const missing = { name: 'a', tileset: 'tls_999999', columns: 2, rows: 2 };
    expect(failure(engine, [step('tilemap.create', missing)]).code).toBe('TARGET_NOT_FOUND');
  });

  it('renames and deletes a map', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('tilemap.update', { tilemap: map, name: 'overworld' })]);
    expect(mapOf(engine).name).toBe('overworld');
    applySteps(engine, [step('tilemap.delete', { tilemap: map })]);
    expect(engine.state().artwork.tilemaps).toEqual([]);
    expect(failure(engine, [step('tilemap.delete', { tilemap: map })]).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('tilemap.resize', () => {
  it('keeps the cells that stay and clears the new ones', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 3, y: 2 }, { x: 0, y: 0 }] }))]);
    applySteps(engine, [step('tilemap.resize', { tilemap: map, columns: 5, rows: 2 })]);
    expect(mapOf(engine)).toMatchObject({ columns: 5, rows: 2 });
    expect(cellsOf(engine)).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(undo(engine).ok).toBe(true);
    expect(cellsOf(engine)[11]).toBe(1);
  });

  it('shifts the content by an offset', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }] }))]);
    applySteps(engine, [step('tilemap.resize', { tilemap: map, columns: 6, rows: 4, offset: { x: 2, y: 1 } })]);
    expect(cellsOf(engine)[1 * 6 + 2]).toBe(2);
    expect(cellsOf(engine).filter((cell) => cell !== 0)).toHaveLength(1);
  });

  it('does nothing when the size and offset are unchanged', () => {
    const world = buildWorld();
    const result = applySteps(world.engine, [step('tilemap.resize', { tilemap: world.map, columns: 4, rows: 3 })]);
    expect(result.noop).toBe(true);
  });
});

describe('map layers', () => {
  it('adds a layer above a named layer and reports its id by ref', () => {
    const world = buildWorld();
    const { engine, map } = world;
    const done = applySteps(engine, [step('map.layer.add', { tilemap: map, name: 'Top' }, 'top')]);
    applySteps(engine, [step('map.layer.add', { tilemap: map, name: 'Mid', above: { by: 'name', name: 'ground' } })]);
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Ground', 'Mid', 'Top']);
    expect(done.created['top']).toBe(layerOf(engine, 'Top').id);
    expect(layerOf(engine, 'Top').cells).toHaveLength(12);
  });

  it('names a layer Layer N when no name is given and refuses a taken name', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('map.layer.add', { tilemap: map })]);
    expect(mapOf(engine).layers.at(-1)?.name).toBe('Layer 2');
    expect(failure(engine, [step('map.layer.add', { tilemap: map, name: 'GROUND' })]).code).toBe('NAME_TAKEN');
  });

  it('updates the name, visibility and lock and rejects an empty update', () => {
    const world = buildWorld();
    const { engine, map } = world;
    const layer = { by: 'name', name: 'Ground' };
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer, name: 'Floor', visible: false, locked: true })]);
    expect(layerOf(engine, 'Floor')).toMatchObject({ visible: false, locked: true });
    expect(failure(engine, [step('map.layer.update', { tilemap: map, layer: { by: 'name', name: 'Floor' } })]).code).toBe('INVALID_OPTION');
  });

  it('reorders layers and rejects a position past the top', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('map.layer.add', { tilemap: map, name: 'Top' })]);
    applySteps(engine, [step('map.layer.reorder', { tilemap: map, layer: { by: 'name', name: 'Top' }, to: 0 })]);
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Top', 'Ground']);
    const error = failure(engine, [step('map.layer.reorder', { tilemap: map, layer: { by: 'name', name: 'Top' }, to: 2 })]);
    expect(error.code).toBe('INDEX_OUT_OF_RANGE');
  });

  it('keeps one layer and guards a locked one', () => {
    const world = buildWorld();
    const { engine, map } = world;
    const ground = { by: 'name', name: 'Ground' };
    expect(failure(engine, [step('map.layer.delete', { tilemap: map, layer: ground })]).code).toBe('LAST_LAYER');
    applySteps(engine, [step('map.layer.add', { tilemap: map, name: 'Top' })]);
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: ground, locked: true })]);
    expect(failure(engine, [step('map.layer.delete', { tilemap: map, layer: ground })]).code).toBe('LAYER_LOCKED');
    const before = canonicalArtwork(engine.state().artwork);
    applySteps(engine, [step('map.layer.delete', { tilemap: map, layer: ground, allowLocked: true })]);
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Top']);
    expect(undo(engine).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  });
});
