/* @layer core @kind test */
import type { AssetSlice, SplitFile } from '@bxel/document';
import { splitIntoAssets } from '@bxel/document';
import {
  decodePalette,
  decodeSheet,
  decodeSprite,
  decodeTilemap,
  decodeTileset,
  encodeSheet,
  encodeTilemap,
  encodeTileset,
  LOAD_ERROR,
  RECOVERED_PALETTE_NAME,
} from '@bxel/document/native';
import type { AssetReport } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { assetClock, assetPreview } from './asset-fixture';
import { encodeSlice } from './asset-bytes';
import { editManifest, replaceEntry } from './container-edit';
import { legacyArtwork } from './legacy-fixture';

const files = (): readonly SplitFile[] => splitIntoAssets(legacyArtwork()).files;

const sliceNamed = (name: string): AssetSlice => {
  const found = files().find((file) => file.name === name);
  if (!found) throw new Error(`No ${name}.`);
  return found.slice;
};

const sliceOf = (report: AssetReport): AssetSlice => {
  if (!report.slice) throw new Error(report.issues[0]?.message ?? 'no slice');
  return report.slice;
};

const tilesetSlice = (): AssetSlice => {
  const found = files().find((file) => file.key.kind === 'tileset');
  if (!found) throw new Error('No tileset.');
  return found.slice;
};

const tilemapSlice = (): AssetSlice => {
  const found = files().find((file) => file.key.kind === 'tilemap');
  if (!found) throw new Error('No tilemap.');
  return found.slice;
};

const paletteOf = (slice: AssetSlice): AssetSlice => {
  const bank = slice.artwork.banks?.[0];
  if (!bank) throw new Error('No bank.');
  return sliceOf(decodePalette(encodeSlice({ kind: 'palette', id: bank.id, name: bank.name, artwork: { banks: [bank] }, links: [] })));
};

describe('sheet files', () => {
  it('round trips byte for byte, with its presets and its clip', () => {
    const bytes = encodeSheet(sliceNamed('Characters'), assetPreview, assetClock);
    const sprites = ['Hero', 'hero', 'Tree'].map((name) => sliceNamed(name));
    const report = decodeSheet(bytes, sprites);
    expect(report.outcome).toBe('ok');
    expect(report.issues).toEqual([]);
    expect(report.preview).toEqual(assetPreview);
    const slice = sliceOf(report);
    expect(slice.artwork.sheets?.[0]?.entries[1]?.source).toEqual({ x: 0, y: 0, width: 2, height: 2 });
    expect(slice.artwork.presets?.map((preset) => preset.name)).toEqual(['Characters sheet']);
    expect(slice.artwork.sprites).toBeUndefined();
    expect(encodeSheet(slice, report.preview, assetClock)).toEqual(bytes);
  });

  it('loads with LINK_MISSING and a placeholder entry when a sprite file is missing', () => {
    const bytes = encodeSlice(sliceNamed('Characters'));
    const available = ['Hero', 'Tree'].map((name) => sliceNamed(name));
    const report = decodeSheet(bytes, available);
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual([LOAD_ERROR.LINK_MISSING]);
    expect(report.issues[0]?.path).toBe('../sprites/hero 2.bxsprite');
    expect(report.missingLinks).toHaveLength(1);
    const slice = sliceOf(report);
    const placeholder = slice.artwork.sprites?.[0];
    expect(slice.artwork.sprites).toHaveLength(1);
    expect(placeholder).toMatchObject({ id: report.missingLinks[0]?.id, name: 'hero 2', width: 2, height: 2 });
    expect(placeholder?.layers[0]?.locked).toBe(true);
    expect(slice.artwork.banks).toHaveLength(1);
    expect(slice.artwork.sheets?.[0]?.entries).toHaveLength(3);
    expect(encodeSheet(slice, null, assetClock)).toEqual(bytes);
  });

  it('refuses a sheet whose manifest drops a link that an entry needs', () => {
    const bytes = editManifest(encodeSlice(sliceNamed('hearts')), (manifest) => {
      manifest['links'] = [];
    });
    const report = decodeSheet(bytes);
    expect(report.outcome).toBe('fatal');
    expect(report.issues[0]?.code).toBe(LOAD_ERROR.REFERENCE_BROKEN);
  });

  it('refuses to write a sheet that has no link for a sprite it places', () => {
    const sheet = sliceNamed('hearts');
    expect(() => encodeSheet({ ...sheet, links: sheet.links.slice(1) }, null, assetClock)).toThrow('needs a link');
  });

  it('is refused by the other readers with a clear kind message', () => {
    const bytes = encodeSlice(sliceNamed('hearts'));
    expect(decodeTilemap(bytes).issues[0]?.message).toBe('This is a Bxel sheet file, not a tilemap file.');
    expect(decodeSprite(bytes).issues[0]?.code).toBe(LOAD_ERROR.WRONG_KIND);
  });
});

describe('tileset files', () => {
  it('round trips byte for byte with its tile sprites and its palette copy', () => {
    const slice = tilesetSlice();
    const bytes = encodeTileset(slice, assetPreview, assetClock);
    const report = decodeTileset(bytes, paletteOf(slice));
    expect(report.outcome).toBe('ok');
    const read = sliceOf(report);
    expect(read.artwork.sprites).toEqual(slice.artwork.sprites);
    expect(read.artwork.tilesets).toEqual(slice.artwork.tilesets);
    expect(encodeTileset(read, report.preview, assetClock)).toEqual(bytes);
  });

  it('keeps the copy as Recovered palette when the palette file is missing', () => {
    const report = decodeTileset(encodeSlice(tilesetSlice()));
    expect(report.outcome).toBe('recoverable');
    expect(report.issues.map((issue) => issue.code)).toEqual([LOAD_ERROR.LINK_MISSING]);
    expect(sliceOf(report).artwork.banks?.[0]?.name).toBe(RECOVERED_PALETTE_NAME);
  });
});

describe('tilemap files', () => {
  it('round trips byte for byte, one cell file per layer', () => {
    const bytes = encodeTilemap(tilemapSlice(), assetPreview, assetClock);
    const report = decodeTilemap(bytes, tilesetSlice());
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(false);
    const read = sliceOf(report);
    expect(read.artwork.tilemaps).toEqual(tilemapSlice().artwork.tilemaps);
    expect(Array.from(read.artwork.tilemaps?.[0]?.layers[0]?.cells ?? []).filter((cell) => cell !== 0)).toHaveLength(3);
    expect(encodeTilemap(read, report.preview, assetClock)).toEqual(bytes);
  });

  it('opens read-only with a placeholder tileset and keeps the cells when the tileset file is missing', () => {
    const report = decodeTilemap(encodeSlice(tilemapSlice()));
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toEqual([LOAD_ERROR.LINK_MISSING]);
    const slice = sliceOf(report);
    expect(slice.artwork.tilesets).toHaveLength(1);
    expect(slice.artwork.tilesets?.[0]?.id).toBe(slice.artwork.tilemaps?.[0]?.tilesetId);
    expect(Array.from(slice.artwork.tilemaps?.[0]?.layers[0]?.cells ?? []).filter((cell) => cell !== 0)).toHaveLength(3);
  });

  it('clears cells whose tile the tileset lacks and reports the layer', () => {
    const tileset = tilesetSlice();
    const [one] = tileset.artwork.tilesets ?? [];
    const trimmed = one ? { ...tileset, artwork: { ...tileset.artwork, tilesets: [{ ...one, tiles: one.tiles.slice(0, 1) }] } } : tileset;
    const report = decodeTilemap(encodeSlice(tilemapSlice()), trimmed);
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.mapDamage).toHaveLength(1);
    expect(report.mapDamage[0]?.code).toBe(LOAD_ERROR.REFERENCE_BROKEN);
  });

  it('opens a layer file of the wrong size as recoverable with that layer empty', () => {
    const slice = tilemapSlice();
    const layer = slice.artwork.tilemaps?.[0]?.layers[0];
    const damaged = replaceEntry(encodeSlice(slice), `tilemaps/${layer?.id}.u32`, new Uint8Array(8));
    const report = decodeTilemap(damaged, tilesetSlice());
    expect(report.outcome).toBe('recoverable');
    expect(report.mapDamage[0]).toMatchObject({ code: LOAD_ERROR.DOCUMENT_INVALID });
    expect(report.issues[0]?.path).toBe(`tilemaps/${layer?.id}.u32`);
  });
});
