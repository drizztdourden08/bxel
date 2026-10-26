/* @layer core @kind test */
import type { AssetSlice, BankId, Sprite } from '@bxel/document';
import { ASSET_FORMAT, LEGACY_FORMAT } from '@bxel/document';
import {
  decodePalette,
  decodeSprite,
  detectAssetKind,
  encodePalette,
  encodeSprite,
  LOAD_ERROR,
  RECOVERED_PALETTE_NAME,
} from '@bxel/document/native';
import type { AssetReport } from '@bxel/document/native';
import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { assetClock, assetPreview, heartBank, heartSprite, PALETTE_PATH, paletteSlice, spriteSlice } from './asset-fixture';
import { editCel, editManifest } from './container-edit';
import { brand } from './fixture-to-artwork';
import { encodeHeart } from './native-fixture';

const sliceOf = (report: AssetReport): AssetSlice => {
  if (!report.slice) throw new Error('The report has no slice.');
  return report.slice;
};

const spriteBytes = (links?: AssetSlice['links']): Uint8Array =>
  encodeSprite(spriteSlice(links), assetPreview, assetClock);

const paletteBytes = (): Uint8Array => encodePalette(paletteSlice(), null, assetClock);

describe('native asset v2: round trip', () => {
  it('writes a sprite byte for byte the same after a decode', () => {
    const first = spriteBytes();
    const palette = sliceOf(decodePalette(paletteBytes()));
    const report = decodeSprite(first, palette);
    expect(report.outcome).toBe('ok');
    expect(report.issues).toEqual([]);
    expect(report.preview).toEqual(assetPreview);
    expect(encodeSprite(sliceOf(report), report.preview, assetClock)).toEqual(first);
  });

  it('reads back every sprite field, its presets, its platform override and its link', () => {
    const palette = sliceOf(decodePalette(paletteBytes()));
    const slice = sliceOf(decodeSprite(spriteBytes(), palette));
    expect(slice.kind).toBe('sprite');
    expect(slice.id).toBe('spr_000010');
    expect(slice.artwork.sprites).toEqual([heartSprite()]);
    expect(slice.artwork.banks).toEqual([heartBank()]);
    expect(slice.artwork.presets).toEqual(spriteSlice().artwork.presets);
    expect(slice.links).toEqual([{ id: 'bnk_000002', path: PALETTE_PATH }]);
  });

  it('writes a palette byte for byte the same after a decode', () => {
    const first = paletteBytes();
    const report = decodePalette(first);
    expect(report.outcome).toBe('ok');
    expect(sliceOf(report).artwork.banks).toEqual([heartBank()]);
    expect(sliceOf(report).links).toEqual([]);
    expect(encodePalette(sliceOf(report), report.preview, assetClock)).toEqual(first);
  });

});

describe('native asset v2: container', () => {
  it('writes the same bytes whatever the key order of the in memory data', () => {
    const heart = heartSprite();
    const reversed: Sprite = {
      cels: heart.cels,
      slices: heart.slices,
      tags: heart.tags,
      frames: heart.frames,
      layers: heart.layers,
      platformStrict: heart.platformStrict,
      platformId: heart.platformId,
      pivot: heart.pivot,
      height: heart.height,
      width: heart.width,
      bankId: heart.bankId,
      role: heart.role,
      name: heart.name,
      id: heart.id,
    };
    const shuffled = { ...spriteSlice(), artwork: { ...spriteSlice().artwork, sprites: [reversed] } };
    expect(encodeSprite(shuffled, assetPreview, assetClock)).toEqual(spriteBytes());
  });

  it('keeps the container layout: mimetype stored first, then manifest, document, cels, preview', () => {
    const methods = new Map<string, number>();
    const files = unzipSync(spriteBytes(), {
      filter: (file) => {
        methods.set(file.name, file.compression);
        return true;
      },
    });
    expect(Object.keys(files)).toEqual([
      'mimetype',
      'manifest.json',
      'sprite.json',
      'cels/cel_000014.idx',
      'cels/cel_000015.idx',
      'preview.png',
    ]);
    expect(strFromU8(files['mimetype'] ?? new Uint8Array())).toBe(ASSET_FORMAT.sprite.mime);
    expect(methods.get('mimetype')).toBe(0);
    const manifest = decodeSprite(spriteBytes()).manifest;
    expect(manifest?.kind).toBe('sprite');
    expect(manifest?.formatVersion).toBe(2);
    expect(manifest?.assetId).toBe('spr_000010');
    expect(manifest?.links).toEqual([{ id: 'bnk_000002', path: PALETTE_PATH }]);
  });
});

describe('native asset v2: links and recovery', () => {
  it('loads the kept copy as Recovered palette and reports the missing file', () => {
    const report = decodeSprite(spriteBytes());
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual([LOAD_ERROR.LINK_MISSING]);
    expect(report.issues[0]?.path).toBe(PALETTE_PATH);
    expect(report.missingLinks).toEqual([{ id: 'bnk_000002', path: PALETTE_PATH }]);
    expect(report.notice).not.toBeNull();
    expect(sliceOf(report).artwork.banks?.[0]?.name).toBe(RECOVERED_PALETTE_NAME);
    expect(sliceOf(report).artwork.banks?.[0]?.slots).toEqual(heartBank().slots);
  });

  it('treats a palette slice of another bank as missing', () => {
    const other = { ...paletteSlice(), artwork: { banks: [{ ...heartBank(), id: brand<BankId>('bnk_000099') }] } };
    const report = decodeSprite(spriteBytes(), other);
    expect(report.missingLinks).toHaveLength(1);
  });

  it('uses the linked palette when it is given, even if it was edited', () => {
    const edited = { ...paletteSlice(), artwork: { banks: [{ ...heartBank(), name: 'Renamed' }] } };
    const report = decodeSprite(spriteBytes(), edited);
    expect(report.outcome).toBe('ok');
    expect(sliceOf(report).artwork.banks?.[0]?.name).toBe('Renamed');
  });

  it('keeps the copy as the palette when the sprite links no file', () => {
    const report = decodeSprite(spriteBytes([]));
    expect(report.outcome).toBe('ok');
    expect(report.issues).toEqual([]);
    expect(sliceOf(report).artwork.banks?.[0]?.name).toBe(heartBank().name);
  });

  it('marks a damaged cel and opens read-only', () => {
    const damaged = editCel(spriteBytes(), 'cel_000014', (pixels) => pixels.fill(7), false);
    const report = decodeSprite(damaged, sliceOf(decodePalette(paletteBytes())));
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.damage.map((item) => item.celId)).toEqual(['cel_000014']);
    expect(report.issues[0]?.code).toBe(LOAD_ERROR.ENTRY_CHECKSUM);
  });

  it('opens a newer format read-only and refuses a newer minimum reader', () => {
    const newer = editManifest(spriteBytes(), (manifest) => {
      manifest.formatVersion = 4;
    });
    const report = decodeSprite(newer, sliceOf(decodePalette(paletteBytes())));
    expect(report.readOnly).toBe(true);
    expect(report.notice).toContain('newer Bxel');
    const tooNew = editManifest(spriteBytes(), (manifest) => {
      manifest.formatVersion = 4;
      manifest.minReaderVersion = 4;
    });
    const refused = decodeSprite(tooNew);
    expect(refused.outcome).toBe('fatal');
    expect(refused.issues[0]?.code).toBe(LOAD_ERROR.VERSION_TOO_NEW);
  });
});

describe('native asset v2: kind', () => {
  it('refuses a palette file opened as a sprite, and the other way round', () => {
    const asSprite = decodeSprite(paletteBytes());
    expect(asSprite.outcome).toBe('fatal');
    expect(asSprite.slice).toBeNull();
    expect(asSprite.issues[0]?.code).toBe(LOAD_ERROR.WRONG_KIND);
    expect(asSprite.issues[0]?.message).toBe('This is a Bxel palette file, not a sprite file.');
    const asPalette = decodePalette(spriteBytes());
    expect(asPalette.issues[0]?.message).toBe('This is a Bxel sprite file, not a palette file.');
  });

  it('refuses a legacy file and says what to do', () => {
    const report = decodeSprite(encodeHeart());
    expect(report.outcome).toBe('fatal');
    expect(report.issues[0]?.code).toBe(LOAD_ERROR.WRONG_KIND);
    expect(report.issues[0]?.message).toContain('older Bxel file');
  });

  it('refuses bytes that are not a Bxel file', () => {
    expect(decodeSprite(Uint8Array.from([1, 2, 3, 4])).issues[0]?.code).toBe(LOAD_ERROR.FILE_NOT_BXEL);
  });

  it('detects the kind from the mimetype even when the extension is wrong', () => {
    const bytes = spriteBytes();
    expect(detectAssetKind(bytes, 'heart.bxsprite')).toEqual({ kind: 'sprite', extensionMatches: true });
    expect(detectAssetKind(bytes, 'heart.bxel')).toEqual({ kind: 'sprite', extensionMatches: false });
    expect(detectAssetKind(bytes, 'heart.PNG')).toEqual({ kind: 'sprite', extensionMatches: false });
    expect(detectAssetKind(bytes)).toEqual({ kind: 'sprite', extensionMatches: null });
    expect(detectAssetKind(paletteBytes(), 'x.txt')?.kind).toBe('palette');
    expect(decodeSprite(bytes).outcome).toBe('recoverable');
  });

  it('detects a legacy file and ignores bytes that are no archive', () => {
    expect(detectAssetKind(encodeHeart(), 'a.bxel')).toEqual({ kind: 'legacy', extensionMatches: true });
    expect(detectAssetKind(Uint8Array.from([1, 2, 3]))).toBeNull();
  });

  it('lists a distinct mime type, extension and progId for every kind', () => {
    const formats = Object.values(ASSET_FORMAT);
    expect(new Set(formats.map((format) => format.mime)).size).toBe(7);
    expect(new Set(formats.map((format) => format.extension)).size).toBe(7);
    expect(new Set(formats.map((format) => format.progId)).size).toBe(7);
    expect(LEGACY_FORMAT.extension).toBe('.bxel');
  });
});
