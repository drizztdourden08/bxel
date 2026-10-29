/* @layer tests @kind test */
import { decodePalette, decodeSprite, encodePalette, encodeSprite, readAssetManifest, rewriteAssetLinks } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { assetClock, assetPreview, PALETTE_PATH, paletteSlice, spriteSlice } from './asset-fixture';

describe('rewriteAssetLinks', () => {
  it('writes the new link path and keeps the file readable with the same content', () => {
    const bytes = encodeSprite(spriteSlice(), assetPreview, assetClock);
    const moved = rewriteAssetLinks(bytes, (link) => ({ id: link.id, path: `../${link.path}` }));
    expect(moved).not.toBeNull();
    expect(readAssetManifest(moved ?? new Uint8Array())?.links).toEqual([{ id: 'bnk_000002', path: `../${PALETTE_PATH}` }]);
    const palette = decodePalette(encodePalette(paletteSlice(), null, assetClock));
    const report = decodeSprite(moved ?? new Uint8Array(), palette.slice);
    expect(report.slice?.id).toBe('spr_000010');
    expect(report.slice?.name).toBe('heart');
    expect(report.missingLinks).toEqual([]);
  });

  it('returns null when no link changes or the bytes are not a Bxel file', () => {
    const bytes = encodeSprite(spriteSlice(), null, assetClock);
    expect(rewriteAssetLinks(bytes, (link) => link)).toBeNull();
    expect(rewriteAssetLinks(Uint8Array.from([1, 2, 3]), (link) => link)).toBeNull();
  });

  it('keeps the preview of the file', () => {
    const bytes = encodeSprite(spriteSlice(), assetPreview, assetClock);
    const moved = rewriteAssetLinks(bytes, (link) => ({ id: link.id, path: 'x/y.bxpalette' }));
    expect(readAssetManifest(moved ?? new Uint8Array())?.preview).toBe('preview.png');
  });
});
