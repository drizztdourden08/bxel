/* @layer core @kind test */
import { tileLayout } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { fixedClock, heartPreview } from './native-fixture';
import { applySteps, buildWorld, checkOneUndoStep, failure, step, tilesetOf } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const BOX = { kind: 'rect', x: 0, y: 0, width: 1, height: 1 } as const;

const tileOf = (world: World, key: number) => tilesetOf(world.engine).tiles.find((tile) => tile.key === key);

describe('tile.shapes', () => {
  it('keeps several shapes on named layers and registers the layers', () => {
    const world = buildWorld();
    const shapes = [
      { ...BOX, layer: 'solid' },
      { kind: 'full', layer: 'water', oneWay: true },
    ];
    applySteps(world.engine, [step('tile.shapes', { tileset: world.tileset, keys: [1], shapes })]);
    expect(tileOf(world, 1)?.shapes).toEqual(shapes);
    expect(tilesetOf(world.engine).collisionLayers).toEqual(['solid', 'water']);
  });

  it('paints a layer over many tiles as one undo step and replaces only that layer', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('tile.shapes', { tileset: world.tileset, keys: [1, 2], shapes: [{ ...BOX, layer: 'hurt' }] })]);
    const paint = step('tile.shapes', { tileset: world.tileset, keys: [1, 2], shapes: [{ kind: 'full' }], mode: 'layer' });
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [paint]));
    expect(tileOf(world, 2)?.shapes).toEqual([
      { ...BOX, layer: 'hurt' },
      { kind: 'full', layer: 'solid' },
    ]);
  });

  it('refuses a shape outside the tile', () => {
    const world = buildWorld();
    const wide = { kind: 'rect', x: 1, y: 0, width: 5, height: 1 };
    expect(failure(world.engine, [step('tile.shapes', { tileset: world.tileset, keys: [1], shapes: [wide] })]).code).toBe('INVALID_OPTION');
  });
});

describe('tile.data and tileset.fields', () => {
  const withFields = (): World => {
    const world = buildWorld();
    const fields = [
      { name: 'hardness', kind: 'int', default: 1 },
      { name: 'surface', kind: 'choice', default: 'stone', choices: ['stone', 'water'] },
    ];
    applySteps(world.engine, [step('tileset.fields', { tileset: world.tileset, fields })]);
    return world;
  };

  it('sets built-in and custom fields on many tiles as one undo step', () => {
    const world = withFields();
    const set = step('tile.data', { tileset: world.tileset, keys: [1, 2], type: 'wall', probability: 0, data: { hardness: 4 } });
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [set]));
    expect(tileOf(world, 1)).toMatchObject({ type: 'wall', probability: 0, data: { hardness: 4 } });
    expect(tileOf(world, 2)).toMatchObject({ type: 'wall', probability: 0, data: { hardness: 4 } });
    applySteps(world.engine, [step('tile.data', { tileset: world.tileset, keys: [1], type: null, data: { hardness: null } })]);
    expect(tileOf(world, 1)?.type).toBeUndefined();
    expect(tileOf(world, 1)?.data).toBeUndefined();
  });

  it('refuses unknown fields and values of the wrong kind', () => {
    const world = withFields();
    const bad = (data: object) => failure(world.engine, [step('tile.data', { tileset: world.tileset, keys: [1], data })]).code;
    expect(bad({ nothing: 1 })).toBe('INVALID_OPTION');
    expect(bad({ hardness: 1.5 })).toBe('INVALID_OPTION');
    expect(bad({ surface: 'lava' })).toBe('INVALID_OPTION');
  });

  it('drops the data of a removed field', () => {
    const world = withFields();
    applySteps(world.engine, [step('tile.data', { tileset: world.tileset, keys: [1], data: { hardness: 3 } })]);
    applySteps(world.engine, [step('tileset.fields', { tileset: world.tileset, fields: [{ name: 'surface', kind: 'choice', default: 'stone', choices: ['stone'] }] })]);
    expect(tileOf(world, 1)?.data).toBeUndefined();
  });

  it('survives a save', () => {
    const world = withFields();
    applySteps(world.engine, [
      step('tile.data', { tileset: world.tileset, keys: [2], probability: 2.5, turns: 'flips', data: { surface: 'water' } }),
      step('tile.shapes', { tileset: world.tileset, keys: [2], shapes: [{ kind: 'full', layer: 'water' }] }),
    ]);
    const report = decodeArtwork(encodeArtwork(world.engine.state(), heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    const tile = report.artwork?.tilesets[0]?.tiles.find((each) => each.key === 2);
    expect(tile).toMatchObject({ probability: 2.5, turns: 'flips', data: { surface: 'water' }, shapes: [{ kind: 'full', layer: 'water' }] });
    expect(report.artwork?.tilesets[0]?.fields?.map((field) => field.name)).toEqual(['hardness', 'surface']);
  });
});

describe('tileset.layout', () => {
  it('lays old tilesets out in list order over the default columns', () => {
    const world = buildWorld();
    const layout = tileLayout(tilesetOf(world.engine));
    expect(layout.columns).toBe(8);
    expect(layout.slots.slice(0, 2).map((tile) => tile?.key)).toEqual([1, 2]);
  });

  it('moves a tile into a hole and keeps the hole behind it', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('tileset.layout', { tileset: world.tileset, columns: 2, move: [{ key: 2, to: 3 }] })]);
    const layout = tileLayout(tilesetOf(world.engine));
    expect(layout.columns).toBe(2);
    expect(layout.slots.map((tile) => tile?.key ?? 0)).toEqual([1, 0, 0, 2]);
  });

  it('swaps two tiles when the target slot is taken', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('tileset.layout', { tileset: world.tileset, move: [{ key: 1, to: 1 }] })]);
    const layout = tileLayout(tilesetOf(world.engine));
    expect(layout.slots.slice(0, 2).map((tile) => tile?.key)).toEqual([2, 1]);
  });
});
