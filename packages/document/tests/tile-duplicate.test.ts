/* @layer core @kind test */
import type { Artwork } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { applySteps, buildWorld, failure, onGround, step } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const undo = (engine: World['engine']) => engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });

const found = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('missing');
  return value;
};

const spriteOf = (artwork: Artwork, spriteId: string) => found(artwork.sprites.find((sprite) => sprite.id === spriteId));

const pixelsOf = (artwork: Artwork, spriteId: string): number[][] => Object.values(spriteOf(artwork, spriteId).cels).map((cel) => Array.from(cel.pixels));

describe('tileset.duplicate', () => {
  it('copies the tileset and every tile sprite with new ids, in one undo step', () => {
    const world = buildWorld();
    const { engine } = world;
    const before = canonicalArtwork(engine.state().artwork);
    const result = applySteps(engine, [step('tileset.duplicate', { tileset: world.tileset }, 'copy')]);
    const artwork = engine.state().artwork;
    const source = found(artwork.tilesets[0]);
    const copy = found(artwork.tilesets[1]);
    expect(artwork.tilesets).toHaveLength(2);
    expect(copy.id).toBe(result.created['copy']);
    expect(copy.name).toBe(`${source.name} copy`);
    expect(copy).toMatchObject({ bankId: source.bankId, tileWidth: source.tileWidth, tileHeight: source.tileHeight, nextKey: source.nextKey });
    expect(copy.tiles.map((tile) => tile.key)).toEqual(source.tiles.map((tile) => tile.key));
    const ids = new Set([...source.tiles, ...copy.tiles].flatMap((tile) => [tile.id, tile.spriteId]));
    expect(ids.size).toBe(8);
    expect(copy.tiles.map((tile) => pixelsOf(artwork, tile.spriteId))).toEqual(source.tiles.map((tile) => pixelsOf(artwork, tile.spriteId)));
    const roles = copy.tiles.map((tile) => spriteOf(artwork, tile.spriteId).role);
    expect(roles).toEqual(['tile', 'tile']);
    expect(undo(engine).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  });

  it('takes a name, numbers an unnamed copy, and refuses a name a tileset already has', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('tileset.duplicate', { tileset: world.tileset, name: 'Dungeon' })]);
    expect(engine.state().artwork.tilesets.map((tileset) => tileset.name)).toEqual(['ground', 'Dungeon']);
    expect(failure(engine, [step('tileset.duplicate', { tileset: world.tileset, name: 'dungeon' })]).code).toBe('NAME_TAKEN');
    applySteps(engine, [step('tileset.duplicate', { tileset: world.tileset })]);
    expect(engine.state().artwork.tilesets.map((tileset) => tileset.name)).toContain('ground copy');
  });
});

describe('tilemap.duplicate', () => {
  it('copies the map layers and cells with new ids on the same tileset, in one undo step', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 1, y: 1 }, { x: 3, y: 2 }] }))]);
    const before = canonicalArtwork(engine.state().artwork);
    const result = applySteps(engine, [step('tilemap.duplicate', { tilemap: world.map }, 'copy')]);
    const source = found(engine.state().artwork.tilemaps[0]);
    const copy = found(engine.state().artwork.tilemaps[1]);
    const sourceLayer = found(source.layers[0]);
    const copyLayer = found(copy.layers[0]);
    expect(copy.id).toBe(result.created['copy']);
    expect(copy.id).not.toBe(source.id);
    expect(copy).toMatchObject({ name: 'level copy', tilesetId: source.tilesetId, columns: 4, rows: 3 });
    expect(copyLayer.id).not.toBe(sourceLayer.id);
    expect(Array.from(copyLayer.cells)).toEqual(Array.from(sourceLayer.cells));
    expect(copyLayer.cells).not.toBe(sourceLayer.cells);
    expect(undo(engine).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  });

  it('refuses a taken name and an unknown map', () => {
    const world = buildWorld();
    const { engine } = world;
    expect(failure(engine, [step('tilemap.duplicate', { tilemap: world.map, name: 'LEVEL' })]).code).toBe('NAME_TAKEN');
    expect(failure(engine, [step('tilemap.duplicate', { tilemap: 'tlm_zzzzzzzz' })]).code).toBe('TARGET_NOT_FOUND');
  });
});
