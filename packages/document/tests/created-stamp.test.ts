/* @layer core @kind test */
import { counterIdSource, createEngine, documentCommands, splitIntoAssets } from '@bxel/document';
import type { Artwork, Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { decodeArtwork } from '@bxel/document/native';
import { decodeFiles, encodeSlice } from './asset-bytes';
import { fixtureToArtwork } from './fixture-to-artwork';
import { documentId } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';
import { legacyArtwork } from './legacy-fixture';
import { artworkOf, encodeHeart, heartState } from './native-fixture';
import { apply, HEART, onSprites, plain } from './sheet-engine';

const NOW = Date.UTC(2026, 9, 24, 12, 0, 0);

const timedEngine = (clock?: () => number, artwork = fixtureToArtwork(heartPairFixture)): Engine =>
  createEngine({
    state: { documentId, revision: 1, artwork, readOnly: false },
    ids: counterIdSource(100),
    commands: documentCommands,
    ...(clock ? { clock } : {}),
  });

const stamped = (artwork: Artwork): Artwork => {
  let at = 1000;
  const next = (): number => (at += 1);
  return {
    ...artwork,
    banks: artwork.banks.map((bank) => ({ ...bank, created: next() })),
    sprites: artwork.sprites.map((sprite) => ({ ...sprite, created: next() })),
    sheets: artwork.sheets.map((sheet) => ({ ...sheet, created: next() })),
    tilesets: artwork.tilesets.map((tileset) => ({ ...tileset, created: next() })),
    tilemaps: artwork.tilemaps.map((tilemap) => ({ ...tilemap, created: next() })),
  };
};

describe('the created time of a new asset', () => {
  it('is taken from the injected clock when a sprite, a sheet, a tileset and a tilemap are created', () => {
    const engine = timedEngine(() => NOW);
    apply(
      engine,
      plain('sprite.create', { name: 'tiny', width: 4, height: 4 }),
      plain('sheet.create', { name: 'Atlas' }),
      plain('tileset.create', { name: 'ground', tileWidth: 8, tileHeight: 8 }, 'ground'),
      plain('tilemap.create', { name: 'level', tileset: { ref: 'ground' }, columns: 2, rows: 2 }),
    );
    const { artwork } = engine.state();
    expect(artwork.sprites.find((sprite) => sprite.name === 'tiny')?.created).toBe(NOW);
    expect(artwork.sheets.find((sheet) => sheet.name === 'Atlas')?.created).toBe(NOW);
    expect(artwork.tilesets.find((tileset) => tileset.name === 'ground')?.created).toBe(NOW);
    expect(artwork.tilemaps.find((tilemap) => tilemap.name === 'level')?.created).toBe(NOW);
  });

  it('is set on a duplicate and never copied from the source', () => {
    const engine = timedEngine(() => NOW, stamped(fixtureToArtwork(heartPairFixture)));
    apply(engine, onSprites('sprite.duplicate', {}, [HEART]));
    expect(engine.state().artwork.sprites.filter((sprite) => sprite.created === NOW)).toHaveLength(1);
  });

  it('stays unknown without a clock', () => {
    const engine = timedEngine();
    apply(engine, plain('sprite.create', { name: 'tiny', width: 4, height: 4 }));
    expect(engine.state().artwork.sprites.every((sprite) => sprite.created === undefined)).toBe(true);
  });

  it('keeps the same time through undo and redo', () => {
    const engine = timedEngine(() => NOW);
    apply(engine, plain('sheet.create', { name: 'Atlas' }));
    const state = engine.state();
    engine.undo({ documentId: state.documentId, expectedRevision: state.revision });
    const undone = engine.state();
    engine.redo({ documentId: undone.documentId, expectedRevision: undone.revision });
    expect(engine.state().artwork.sheets.find((sheet) => sheet.name === 'Atlas')?.created).toBe(NOW);
  });
});

describe('the created time in the asset files', () => {
  it('is saved in every kind of asset file and read back', () => {
    const artwork = stamped(legacyArtwork());
    const files = splitIntoAssets(artwork).files.map((file) => ({ path: file.name, bytes: encodeSlice(file.slice) }));
    const { sources } = decodeFiles(files);
    const all = sources.map((source) => source.slice.artwork);
    const times = (items: readonly { id: string; created?: number }[]): Map<string, number | undefined> =>
      new Map(items.map((item) => [item.id, item.created]));
    const read = {
      banks: times(all.flatMap((each) => each.banks ?? [])),
      sprites: times(all.flatMap((each) => each.sprites ?? [])),
      sheets: times(all.flatMap((each) => each.sheets ?? [])),
      tilesets: times(all.flatMap((each) => each.tilesets ?? [])),
      tilemaps: times(all.flatMap((each) => each.tilemaps ?? [])),
    };
    for (const bank of artwork.banks) expect(read.banks.get(bank.id)).toBe(bank.created);
    for (const sprite of artwork.sprites) expect(read.sprites.get(sprite.id)).toBe(sprite.created);
    for (const sheet of artwork.sheets) expect(read.sheets.get(sheet.id)).toBe(sheet.created);
    for (const tileset of artwork.tilesets) expect(read.tilesets.get(tileset.id)).toBe(tileset.created);
    for (const tilemap of artwork.tilemaps) expect(read.tilemaps.get(tilemap.id)).toBe(tilemap.created);
  });

  it('reads a file saved before the time existed as unknown', () => {
    const files = splitIntoAssets(legacyArtwork()).files.map((file) => ({ path: file.name, bytes: encodeSlice(file.slice) }));
    const { sources } = decodeFiles(files);
    const sheets = sources.flatMap((source) => source.slice.artwork.sheets ?? []);
    expect(sheets.length).toBeGreaterThan(0);
    expect(sheets.every((sheet) => sheet.created === undefined)).toBe(true);
  });

  it('is saved in a whole older file and read back, and stays unknown when it was never set', () => {
    const state = heartState();
    const stamped = { ...state, artwork: { ...state.artwork, sprites: state.artwork.sprites.map((sprite) => ({ ...sprite, created: NOW })) } };
    const read = artworkOf(decodeArtwork(encodeHeart(stamped)));
    expect(read.sprites.every((sprite) => sprite.created === NOW)).toBe(true);
    const plain = artworkOf(decodeArtwork(encodeHeart()));
    expect(plain.sprites.every((sprite) => sprite.created === undefined)).toBe(true);
  });
});
