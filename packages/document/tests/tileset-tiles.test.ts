/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { heartEngine } from './heart-engine';
import { applySteps, buildWorld, cellsOf, failure, onGround, step, tilesetOf } from './tile-engine';

const undo = (engine: ReturnType<typeof buildWorld>['engine']) =>
  engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });

describe('tileset.create and tileset.update', () => {
  it('creates a tileset on the default bank as one undo step', () => {
    const { engine } = heartEngine();
    const before = canonicalArtwork(engine.state().artwork);
    const result = applySteps(engine, [step('tileset.create', { name: 'ground', tileWidth: 8, tileHeight: 8 }, 'ts')]);
    expect(tilesetOf(engine)).toMatchObject({ name: 'ground', bankId: 'bnk_000002', tileWidth: 8, nextKey: 1, tiles: [] });
    expect(result.created['ts']).toBe(tilesetOf(engine).id);
    expect(result.changes.tilesets).toEqual([{ id: tilesetOf(engine).id, kind: 'added' }]);
    expect(undo(engine).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  });

  it('rejects a taken name, a bad size and an unknown bank', () => {
    const world = buildWorld();
    const { engine } = world;
    expect(failure(engine, [step('tileset.create', { name: 'GROUND', tileWidth: 8, tileHeight: 8 })]).code).toBe('NAME_TAKEN');
    expect(failure(engine, [step('tileset.create', { name: 'big', tileWidth: 0, tileHeight: 8 })]).code).toBe('SIZE_OUT_OF_RANGE');
    const options = { name: 'x', tileWidth: 8, tileHeight: 8, bankId: 'bnk_999999' };
    expect(failure(engine, [step('tileset.create', options)]).code).toBe('TARGET_NOT_FOUND');
  });

  it('renames a tileset and refuses a name another tileset has', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('tileset.create', { name: 'walls', tileWidth: 4, tileHeight: 4 })]);
    applySteps(engine, [step('tileset.update', { tileset: world.tileset, name: 'terrain' })]);
    expect(tilesetOf(engine).name).toBe('terrain');
    expect(failure(engine, [step('tileset.update', { tileset: world.tileset, name: 'Walls' })]).code).toBe('NAME_TAKEN');
  });
});

describe('tile.add', () => {
  it('adds a tile sprite of role tile in the tileset bank and size', () => {
    const world = buildWorld();
    const { engine } = world;
    const tiles = tilesetOf(engine).tiles;
    expect(tiles.map((tile) => tile.key)).toEqual([1, 2]);
    const sprite = engine.state().artwork.sprites.find((item) => item.id === tiles[0]?.spriteId);
    expect(sprite).toMatchObject({ role: 'tile', name: 'grass tile', bankId: 'bnk_000002', width: 2, height: 2 });
    expect(tilesetOf(engine).nextKey).toBe(3);
  });

  it('names a tile after the tileset and its key when no name is given', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('tile.add', { tileset: world.tileset })]);
    const last = tilesetOf(world.engine).tiles.at(-1);
    const sprite = world.engine.state().artwork.sprites.find((item) => item.id === last?.spriteId);
    expect(sprite?.name).toBe('ground 3');
  });

  it('is one undo step and never reuses a key', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('tile.add', { tileset: world.tileset })]);
    expect(undo(engine).ok).toBe(true);
    expect(tilesetOf(engine).tiles).toHaveLength(2);
    applySteps(engine, [step('tile.delete', { tileset: world.tileset, key: 2 })]);
    applySteps(engine, [step('tile.add', { tileset: world.tileset })]);
    expect(tilesetOf(engine).tiles.map((tile) => tile.key)).toEqual([1, 3]);
    expect(tilesetOf(engine).nextKey).toBe(4);
  });

  it('rejects a taken sprite name', () => {
    const world = buildWorld();
    const error = failure(world.engine, [step('tile.add', { tileset: world.tileset, name: 'rock tile' })]);
    expect(error.code).toBe('NAME_TAKEN');
  });
});

describe('tile.delete', () => {
  it('refuses a placed tile unless a replacement key is given', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }] }))]);
    const error = failure(engine, [step('tile.delete', { tileset: world.tileset, key: 2 })]);
    expect(error.code).toBe('TILE_IN_USE');
    expect(tilesetOf(engine).tiles).toHaveLength(2);
  });

  it('points cells at the replacement and keeps their flip flags', () => {
    const world = buildWorld();
    const { engine } = world;
    const flags = { flipX: true, diagonal: true };
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, flags, cells: [{ x: 1, y: 0 }] }))]);
    const spriteCount = engine.state().artwork.sprites.length;
    applySteps(engine, [step('tile.delete', { tileset: world.tileset, key: 2, replacement: 1 })]);
    expect(cellsOf(engine)[1]).toBe(((0x80000000 | 0x20000000 | 1) >>> 0));
    expect(tilesetOf(engine).tiles.map((tile) => tile.key)).toEqual([1]);
    expect(engine.state().artwork.sprites).toHaveLength(spriteCount - 1);
    expect(undo(engine).ok).toBe(true);
    expect(cellsOf(engine)[1]).toBe(((0x80000000 | 0x20000000 | 2) >>> 0));
  });

  it('clears the cells when the replacement is 0', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 3, y: 2 }] }))]);
    applySteps(engine, [step('tile.delete', { tileset: world.tileset, key: 2, replacement: 0 })]);
    expect(cellsOf(engine).every((cell) => cell === 0)).toBe(true);
  });

  it('deletes an unplaced tile and rejects a missing or self replacement', () => {
    const world = buildWorld();
    const { engine } = world;
    expect(failure(engine, [step('tile.delete', { tileset: world.tileset, key: 9 })]).code).toBe('TARGET_NOT_FOUND');
    const own = failure(engine, [step('tile.delete', { tileset: world.tileset, key: 2, replacement: 2 })]);
    expect(own.code).toBe('INVALID_OPTION');
    const missing = failure(engine, [step('tile.delete', { tileset: world.tileset, key: 2, replacement: 9 })]);
    expect(missing.code).toBe('TARGET_NOT_FOUND');
    applySteps(engine, [step('tile.delete', { tileset: world.tileset, key: 2 })]);
    expect(tilesetOf(engine).tiles.map((tile) => tile.key)).toEqual([1]);
  });
});

describe('tileset.delete', () => {
  it('refuses while a tilemap uses the tileset', () => {
    const world = buildWorld();
    const error = failure(world.engine, [step('tileset.delete', { tileset: world.tileset })]);
    expect(error.code).toBe('TILESET_IN_USE');
  });

  it('removes the tileset and its tile sprites once the maps are gone', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('tilemap.delete', { tilemap: world.map })]);
    applySteps(engine, [step('tileset.delete', { tileset: world.tileset })]);
    const { sprites, tilesets } = engine.state().artwork;
    expect(tilesets).toEqual([]);
    expect(sprites.map((sprite) => sprite.role)).toEqual(['sprite', 'sprite']);
    expect(undo(engine).ok).toBe(true);
    expect(engine.state().artwork.sprites).toHaveLength(4);
  });
});

describe('tile.unique', () => {
  it('copies a placed tile into a new key and points only the given cells at it', () => {
    const world = buildWorld();
    const { engine } = world;
    const cells = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, flags: { flipY: true }, cells }))]);
    const made = applySteps(engine, [
      step('tile.unique', onGround(world, { cells: cells.slice(0, 2), name: 'rock variant' }), 'variant'),
    ]);
    expect(tilesetOf(engine).tiles.map((tile) => tile.key)).toEqual([1, 2, 3]);
    expect(cellsOf(engine).slice(0, 4)).toEqual([0x40000003, 0x40000003, 0x40000002, 0]);
    const copy = engine.state().artwork.sprites.find((sprite) => sprite.id === made.created['variant']);
    const source = engine.state().artwork.sprites.find((sprite) => sprite.name === 'rock tile');
    expect(copy).toMatchObject({ role: 'tile', name: 'rock variant', width: 2 });
    expect(copy?.id).not.toBe(source?.id);
    const pixels = (sprite: typeof copy) => Object.values(sprite?.cels ?? {}).map((cel) => Array.from(cel.pixels));
    expect(pixels(copy)).toEqual(pixels(source));
  });

  it('lets the copy change without touching the original', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }] }))]);
    applySteps(engine, [step('tile.unique', onGround(world, { cells: [{ x: 0, y: 0 }] }), 'copy')]);
    const sprites = engine.state().artwork.sprites;
    const copy = sprites.find((sprite) => sprite.name === 'ground 3');
    const edit = { name: 'pixels.patch', targets: { sprites: [copy?.id ?? ''], layers: { by: 'all' }, frames: { by: 'all' } }, options: { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: Uint8Array.from([6]) } };
    applySteps(engine, [edit as never]);
    const after = engine.state().artwork.sprites;
    const pixelsOf = (name: string) =>
      Object.values(after.find((sprite) => sprite.name === name)?.cels ?? {}).map((cel) => Array.from(cel.pixels));
    expect(pixelsOf('rock tile')).toEqual([[2, 3, 4, 5]]);
    expect(pixelsOf('ground 3')).toEqual([[6, 3, 4, 5]]);
  });

  it('rejects empty cells, mixed tiles and cells outside the map', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }] }))]);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 1, y: 0 }] }))]);
    const empty = failure(engine, [step('tile.unique', onGround(world, { cells: [{ x: 3, y: 0 }] }))]);
    expect(empty.code).toBe('INVALID_OPTION');
    const mixed = failure(engine, [step('tile.unique', onGround(world, { cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }))]);
    expect(mixed.code).toBe('INVALID_OPTION');
    const outside = failure(engine, [step('tile.unique', onGround(world, { cells: [{ x: 9, y: 0 }] }))]);
    expect(outside.code).toBe('OUT_OF_BOUNDS');
  });
});
