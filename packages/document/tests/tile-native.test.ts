/* @layer core @kind test */
import type { Artwork } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { editDocument, editFiles, replaceEntry } from './container-edit';
import { fixedClock, heartPreview } from './native-fixture';
import { applySteps, buildWorld, cellsOf, layerOf, onGround, step } from './tile-engine';

const encoded = (world: ReturnType<typeof buildWorld>, artwork?: Artwork): Uint8Array => {
  const state = world.engine.state();
  return encodeArtwork({ ...state, artwork: artwork ?? state.artwork }, heartPreview, fixedClock);
};

const painted = (): ReturnType<typeof buildWorld> => {
  const world = buildWorld();
  const cells = [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 2 }];
  applySteps(world.engine, [step('map.paint', onGround(world, { tile: 2, flags: { flipX: true, diagonal: true }, cells }))]);
  applySteps(world.engine, [step('map.layer.add', { tilemap: world.map, name: 'Top' })]);
  applySteps(world.engine, [step('map.paint', { tilemap: world.map, layer: { by: 'name', name: 'Top' }, tile: 1, cells: [{ x: 1, y: 1 }] })]);
  return world;
};

describe('tilemaps in the .bxel container', () => {
  it('keeps ids, keys, flags and layer order through save and reopen', () => {
    const world = painted();
    const report = decodeArtwork(encoded(world));
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(false);
    expect(report.mapDamage).toEqual([]);
    expect(report.artwork).toEqual(world.engine.state().artwork);
    const reopened = report.artwork?.tilemaps[0];
    expect(reopened?.layers.map((layer) => layer.name)).toEqual(['Ground', 'Top']);
    expect(Array.from(reopened?.layers[0]?.cells ?? []).filter((cell) => cell !== 0)).toEqual([0xa0000002, 0xa0000002, 0xa0000002]);
    expect(report.artwork?.tilesets[0]?.nextKey).toBe(3);
  });

  it('writes the same bytes twice and one cell file per layer', () => {
    const world = painted();
    expect(encoded(world)).toEqual(encoded(world));
    const report = decodeArtwork(encoded(world));
    const paths = report.manifest?.entries.map((entry) => entry.path).filter((path) => path.startsWith('tilemaps/'));
    expect(paths).toEqual(layerPaths(world));
  });

  it('opens a map whose layer file is damaged as recoverable and read-only with that layer empty', () => {
    const world = painted();
    const [first] = layerPaths(world);
    const damaged = editFiles(encoded(world), (files) => {
      const bytes = (files[first ?? ''] ?? new Uint8Array()).slice();
      bytes[0] = 0xff;
      files[first ?? ''] = bytes;
    });
    const report = decodeArtwork(damaged);
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.mapDamage).toEqual([
      expect.objectContaining({ tilemapId: world.map, layerId: layerOf(world.engine).id, code: 'ENTRY_CHECKSUM' }),
    ]);
    expect(report.issues.map((issue) => issue.path)).toContain(first);
    const ground = report.artwork?.tilemaps[0]?.layers[0];
    expect(Array.from(ground?.cells ?? [])).toEqual(new Array(12).fill(0));
    expect(report.artwork?.tilemaps[0]?.layers[1]?.cells[5]).toBe(1);
  });

  it('opens a layer file of the wrong size as recoverable with that layer empty', () => {
    const world = painted();
    const [first] = layerPaths(world);
    const report = decodeArtwork(replaceEntry(encoded(world), first ?? '', new Uint8Array(8)));
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.mapDamage[0]).toMatchObject({ code: 'DOCUMENT_INVALID' });
    expect(Array.from(report.artwork?.tilemaps[0]?.layers[0]?.cells ?? [])).toEqual(new Array(12).fill(0));
  });

});

describe('tilemap integrity on open', () => {
  it('diagnoses cells whose key has no tile, clears them and opens read-only', () => {
    const world = painted();
    const artwork = world.engine.state().artwork;
    const [tileset] = artwork.tilesets;
    const trimmed: Artwork = { ...artwork, tilesets: tileset ? [{ ...tileset, tiles: tileset.tiles.slice(0, 1) }] : [] };
    const report = decodeArtwork(encoded(world, trimmed));
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.mapDamage).toHaveLength(1);
    expect(report.mapDamage[0]).toMatchObject({ code: 'REFERENCE_BROKEN', layerId: layerOf(world.engine).id });
    expect(report.issues.some((issue) => issue.code === 'REFERENCE_BROKEN')).toBe(true);
    expect(Array.from(report.artwork?.tilemaps[0]?.layers[0]?.cells ?? []).every((cell) => cell === 0)).toBe(true);
    expect(report.artwork?.tilemaps[0]?.layers[1]?.cells[5]).toBe(1);
    expect(cellsOf(world.engine).filter((cell) => cell !== 0)).toHaveLength(3);
  });

  it('refuses a tile whose sprite is not a tile sprite', () => {
    const world = painted();
    const tileSprite = world.engine.state().artwork.tilesets[0]?.tiles[0]?.spriteId;
    const bytes = editDocument(encoded(world), (document) => {
      for (const sprite of document.sprites) {
        if (sprite.id === tileSprite) sprite['role'] = 'sprite';
      }
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('fatal');
    expect(report.issues[0]?.code).toBe('DOCUMENT_INVALID');
  });

  it('refuses a map that names a tileset the file lacks', () => {
    const world = painted();
    const bytes = editDocument(encoded(world), (document) => {
      document['tilesets'] = [];
    });
    expect(decodeArtwork(bytes).outcome).toBe('fatal');
  });
});

const layerPaths = (world: ReturnType<typeof buildWorld>): string[] =>
  (world.engine.state().artwork.tilemaps[0]?.layers ?? []).map((layer) => `tilemaps/${layer.id}.u32`).sort();
