/* @layer core @kind test */
import { splitIntoAssets } from '@bxel/document';
import { decodeArtwork, decodeTileset, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { encodeSlice } from './asset-bytes';
import { fixedClock, heartPreview } from './native-fixture';
import { tilesetReport } from './tileset-file';
import { applySteps, buildWorld, checkOneUndoStep, failure, step, tilesetOf } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const RECT = { kind: 'rect', x: 0, y: 1, width: 2, height: 1 } as const;

const POLYGON = { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }] } as const;

const setShape = (world: World, key: number, shape: unknown) =>
  step('tile.collision', { tileset: world.tileset, key, shape });

const collisionOf = (world: World, key: number) => tilesetOf(world.engine).tiles.find((tile) => tile.key === key)?.collision;

describe('tile.collision', () => {
  it('sets a full, a rectangle and a polygon shape and clears it with none', () => {
    const world = buildWorld();
    applySteps(world.engine, [setShape(world, 1, { kind: 'full' }), setShape(world, 2, RECT)]);
    expect(collisionOf(world, 1)).toEqual({ kind: 'full' });
    expect(collisionOf(world, 2)).toEqual(RECT);
    applySteps(world.engine, [setShape(world, 2, POLYGON)]);
    expect(collisionOf(world, 2)).toEqual(POLYGON);
    applySteps(world.engine, [setShape(world, 1, { kind: 'none' })]);
    expect(collisionOf(world, 1)).toBeUndefined();
    expect('collision' in (tilesetOf(world.engine).tiles[0] ?? {})).toBe(false);
  });

  it('is one undo step', () => {
    const world = buildWorld();
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [setShape(world, 2, RECT)]));
  });

  it('refuses shapes outside the tile, a flat polygon and a missing tile, and changes nothing', () => {
    const world = buildWorld();
    const revision = world.engine.state().revision;
    const wide = { kind: 'rect', x: 1, y: 0, width: 2, height: 1 };
    expect(failure(world.engine, [setShape(world, 1, wide)]).code).toBe('INVALID_OPTION');
    const flat = { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] };
    expect(failure(world.engine, [setShape(world, 1, flat)]).code).toBe('INVALID_OPTION');
    const far = { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 2 }] };
    expect(failure(world.engine, [setShape(world, 1, far)]).code).toBe('INVALID_OPTION');
    expect(failure(world.engine, [setShape(world, 9, { kind: 'full' })]).code).toBe('TARGET_NOT_FOUND');
    expect(world.engine.state().revision).toBe(revision);
  });

  it('is copied by tile.unique and by tileset.duplicate', () => {
    const world = buildWorld();
    applySteps(world.engine, [setShape(world, 2, RECT)]);
    applySteps(world.engine, [step('map.paint', { tilemap: world.map, layer: { by: 'name', name: 'Ground' }, tile: 2, cells: [{ x: 0, y: 0 }] })]);
    applySteps(world.engine, [step('tile.unique', { tilemap: world.map, layer: { by: 'name', name: 'Ground' }, cells: [{ x: 0, y: 0 }] })]);
    expect(collisionOf(world, 3)).toEqual(RECT);
    applySteps(world.engine, [step('tileset.duplicate', { tileset: world.tileset, name: 'copy' })]);
    const copy = world.engine.state().artwork.tilesets.find((set) => set.name === 'copy');
    expect(copy?.tiles.find((tile) => tile.key === 2)?.collision).toEqual(RECT);
  });
});

describe('collision in saved files', () => {
  const shaped = (): World => {
    const world = buildWorld();
    applySteps(world.engine, [setShape(world, 1, { kind: 'full' }), setShape(world, 2, POLYGON)]);
    return world;
  };

  it('survives the older single file container', () => {
    const world = shaped();
    const state = world.engine.state();
    const report = decodeArtwork(encodeArtwork(state, heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    expect(report.artwork?.tilesets[0]?.tiles.map((tile) => tile.collision)).toEqual([{ kind: 'full' }, POLYGON]);
  });

  it('survives the tileset file', () => {
    const world = shaped();
    const report = tilesetReport(world.engine);
    expect(report.outcome).toBe('ok');
    expect(report.slice?.artwork.tilesets?.[0]?.tiles.map((tile) => tile.collision)).toEqual([{ kind: 'full' }, POLYGON]);
  });

  it('refuses a tileset file whose shape leaves the tile', () => {
    const world = shaped();
    const file = splitIntoAssets(world.engine.state().artwork).files.find((each) => each.key.kind === 'tileset');
    const tileset = file?.slice.artwork.tilesets?.[0];
    if (!file || !tileset) throw new Error('no tileset file');
    const bad = { ...tileset, tiles: tileset.tiles.map((tile) => ({ ...tile, collision: { kind: 'rect' as const, x: 0, y: 0, width: 9, height: 9 } })) };
    const report = decodeTileset(encodeSlice({ ...file.slice, artwork: { ...file.slice.artwork, tilesets: [bad] } }));
    expect(report.slice).toBeNull();
    expect(report.issues.length).toBeGreaterThan(0);
  });
});
