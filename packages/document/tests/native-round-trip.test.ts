/* @layer core @kind test */
import type { BankId, DocumentState, MapLayerId, Artwork, SpriteId, TilemapId, TilesetId, TileId } from '@bxel/document';
import { crc32, decodeArtwork, encodeArtwork, FORMAT_VERSION, MIMETYPE } from '@bxel/document/native';
import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import { heartEngine, patchStep, request } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';
import { encodeHeart, fixedClock, heartPreview, heartState, artworkOf } from './native-fixture';

const withTilemap = (artwork: Artwork): Artwork => ({
  ...artwork,
  sprites: artwork.sprites.map((sprite) => (sprite.id === 'spr_000010' ? { ...sprite, role: 'tile' as const } : sprite)),
  tilesets: [
    {
      id: brand<TilesetId>('tls_000060'),
      name: 'ground',
      bankId: brand<BankId>('bnk_000002'),
      tileWidth: 8,
      tileHeight: 8,
      nextKey: 2,
      tiles: [{ id: brand<TileId>('til_000061'), key: 1, spriteId: brand<SpriteId>('spr_000010') }],
    },
  ],
  tilemaps: [
    {
      id: brand<TilemapId>('tlm_000062'),
      name: 'level',
      tilesetId: brand<TilesetId>('tls_000060'),
      columns: 2,
      rows: 2,
      layers: [
        {
          id: brand<MapLayerId>('tml_000063'),
          name: 'Ground',
          visible: true,
          locked: false,
          cells: Uint32Array.from([1, 0x80000001, 0, 0xe0000001]),
        },
      ],
    },
  ],
});

describe('native container round trip', () => {
  it('reads back every field and every cel byte of the heart pair', () => {
    const report = decodeArtwork(encodeHeart());
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(false);
    expect(report.notice).toBeNull();
    expect(report.issues).toEqual([]);
    expect(report.damage).toEqual([]);
    expect(artworkOf(report)).toEqual(fixtureToArtwork(heartPairFixture));
    expect(report.preview).toEqual(heartPreview);
    expect(report.manifest?.formatVersion).toBe(FORMAT_VERSION);
    expect(report.manifest?.artworkId).toBe('art_000001');
  });

  it('writes the same bytes for the same artwork and clock', () => {
    const state = heartState();
    const first = encodeHeart(state);
    const second = encodeHeart(state);
    expect(second).toEqual(first);
    expect(crc32(second)).toBe(crc32(first));
    expect(encodeHeart(heartState())).toEqual(first);
  });

  it('writes a different file when the clock moves', () => {
    const state = heartState();
    const later = encodeArtwork(state, heartPreview, () => fixedClock() + 5000);
    expect(later).not.toEqual(encodeHeart(state));
  });

});

describe('native container layout', () => {
  it('keeps the entry order fixed with mimetype stored first and the preview stored', () => {
    const methods = new Map<string, number>();
    const files = unzipSync(encodeHeart(), {
      filter: (file) => {
        methods.set(file.name, file.compression);
        return true;
      },
    });
    expect(Object.keys(files)).toEqual([
      'mimetype',
      'manifest.json',
      'document.json',
      'cels/cel_000014.idx',
      'cels/cel_000015.idx',
      'cels/cel_000024.idx',
      'preview.png',
    ]);
    expect(strFromU8(files['mimetype'] ?? new Uint8Array())).toBe(MIMETYPE);
    expect(methods.get('mimetype')).toBe(0);
    expect(methods.get('preview.png')).toBe(0);
    expect(methods.get('document.json')).toBe(8);
  });

  it('lists every entry with its length and CRC-32 in the manifest', () => {
    const files = unzipSync(encodeHeart());
    const manifest = decodeArtwork(encodeHeart()).manifest;
    expect(manifest?.entries.map((entry) => entry.path)).toEqual([
      'document.json',
      'cels/cel_000014.idx',
      'cels/cel_000015.idx',
      'cels/cel_000024.idx',
      'preview.png',
    ]);
    for (const entry of manifest?.entries ?? []) {
      const data = files[entry.path] ?? new Uint8Array();
      expect(entry.length).toBe(data.length);
      expect(entry.crc32).toBe(crc32(data));
    }
    expect(manifest?.savedAt).toBe('2026-10-22T14:03:11Z');
  });

  it('opens a file without a preview', () => {
    const report = decodeArtwork(encodeArtwork(heartState(), null, fixedClock));
    expect(report.outcome).toBe('ok');
    expect(report.preview).toBeNull();
    expect(report.manifest?.preview).toBeNull();
  });

});

describe('native container variants', () => {
  it('round trips a tilemap layer through its little-endian word file', () => {
    const base = heartState();
    const state: DocumentState = { ...base, artwork: withTilemap(base.artwork) };
    const report = decodeArtwork(encodeArtwork(state, heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    expect(artworkOf(report)).toEqual(state.artwork);
    const files = unzipSync(encodeArtwork(state, heartPreview, fixedClock));
    expect(Array.from(files['tilemaps/tml_000063.u32'] ?? [])).toEqual([1, 0, 0, 0, 1, 0, 0, 0x80, 0, 0, 0, 0, 1, 0, 0, 0xe0]);
  });

  it('encodes a held state exactly as before 50 later strokes', () => {
    const { engine } = heartEngine();
    const held = engine.state();
    const before = encodeArtwork(held, heartPreview, fixedClock);
    for (let index = 0; index < 50; index += 1) {
      engine.execute(request([patchStep((index % 6) + 1)], { baseRevision: engine.state().revision }));
    }
    expect(engine.state().revision).toBe(51);
    expect(encodeArtwork(held, heartPreview, fixedClock)).toEqual(before);
    expect(encodeArtwork(engine.state(), heartPreview, fixedClock)).not.toEqual(before);
  });
});
