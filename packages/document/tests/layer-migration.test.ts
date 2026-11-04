/* @layer core @kind test */
import { decodePalette, decodeSprite, encodePalette, encodeSprite } from '@bxel/document/native';
import { strFromU8, strToU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { assetClock, assetPreview, paletteSlice, spriteSlice } from './asset-fixture';
import { editManifest, replaceEntry } from './container-edit';

type LayerJson = Record<string, unknown> & { lock: { pixels: boolean; transparency: boolean } };
type SpriteFile = { sprite: { layers: LayerJson[] } };

const SPRITE_ENTRY = 'sprite.json';

const asVersion3 = (bytes: Uint8Array, lockFirst: boolean): Uint8Array => {
  const file = JSON.parse(strFromU8(unzipSync(bytes)[SPRITE_ENTRY] ?? new Uint8Array())) as SpriteFile;
  const layers = file.sprite.layers.map(({ lock, ...rest }, at) => ({
    ...rest,
    locked: lockFirst && at === 0 ? true : lock.pixels,
    ...(lockFirst && at === 0 ? { lockTransparency: true } : {}),
  }));
  const oldFile = { ...file, sprite: { ...file.sprite, layers } };
  return editManifest(replaceEntry(bytes, SPRITE_ENTRY, strToU8(JSON.stringify(oldFile))), (manifest) => {
    manifest.formatVersion = 3;
    manifest.minReaderVersion = 2;
  });
};

const palette = () => {
  const slice = decodePalette(encodePalette(paletteSlice(), null, assetClock)).slice;
  if (!slice) throw new Error('The palette did not open.');
  return slice;
};

const firstSprite = (report: ReturnType<typeof decodeSprite>) => report.slice?.artwork.sprites?.[0];

describe('K3 a sprite file from before the layer model', { tags: ['critical'] }, () => {
  it('opens with the old locks as lock kinds and the same pixels', () => {
    const now = encodeSprite(spriteSlice(), assetPreview, assetClock);
    const current = decodeSprite(now, palette());
    const old = decodeSprite(asVersion3(now, true), palette());
    expect(old.outcome).toBe('ok');
    expect(old.readOnly).toBe(false);
    const layer = firstSprite(old)?.layers[0];
    expect(layer?.lock).toEqual({ pixels: true, transparency: true, position: false });
    expect(Object.keys(layer ?? {})).not.toContain('locked');
    expect(firstSprite(old)?.cels).toEqual(firstSprite(current)?.cels);
  });

  it('writes the new format, which a reader before version 4 refuses', () => {
    const report = decodeSprite(asVersion3(encodeSprite(spriteSlice(), assetPreview, assetClock), false), palette());
    const slice = report.slice;
    if (!slice) throw new Error('The old file did not open.');
    const again = decodeSprite(encodeSprite(slice, assetPreview, assetClock), palette());
    expect(again.manifest?.minReaderVersion).toBe(4);
    expect(again.slice?.artwork.sprites).toEqual(slice.artwork.sprites);
  });
});
