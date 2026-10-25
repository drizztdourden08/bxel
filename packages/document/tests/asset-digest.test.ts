/* @layer tests @kind test */
import type { AssetSlice, Sprite } from '@bxel/document';
import { assetDigest, encodePalette, encodeSprite } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { assetClock, assetPreview, heartSprite, paletteSlice, spriteSlice } from './asset-fixture';

const WRITER_CLOCK = (): number => 0;

const withSprite = (change: (sprite: Sprite) => Sprite): AssetSlice => {
  const slice = spriteSlice();
  const [sprite] = slice.artwork.sprites ?? [];
  if (!sprite) throw new Error('the fixture has a sprite');
  return { ...slice, artwork: { ...slice.artwork, sprites: [change(sprite)] } };
};

const flipFirstPixel = (sprite: Sprite): Sprite => {
  const [id, cel] = Object.entries(sprite.cels)[0] ?? [];
  if (!id || !cel) throw new Error('the sprite has a cel');
  const pixels = cel.pixels.slice();
  pixels[0] = (pixels[0] ?? 0) ^ 1;
  return { ...sprite, cels: { ...sprite.cels, [id]: { ...cel, pixels } } };
};

describe('assetDigest', () => {
  it('is the same for equal content whatever the preview or the clock', () => {
    const early = encodeSprite(spriteSlice(), null, WRITER_CLOCK);
    const late = encodeSprite(spriteSlice(), assetPreview, assetClock);
    expect(early).not.toEqual(late);
    expect(assetDigest(spriteSlice())).toBe(assetDigest(spriteSlice()));
  });

  it('changes with a pixel, a name or the links, exactly when the encoded file would change', () => {
    const base = spriteSlice();
    const edits: AssetSlice[] = [
      withSprite(flipFirstPixel),
      withSprite((sprite) => ({ ...sprite, name: `${sprite.name} two` })),
      spriteSlice([{ id: 'bnk_000002', path: '../other/bxel-16.bxpalette' }]),
    ];
    for (const edit of edits) {
      expect(assetDigest(edit)).not.toBe(assetDigest(base));
      expect(encodeSprite(edit, null, WRITER_CLOCK)).not.toEqual(encodeSprite(base, null, WRITER_CLOCK));
    }
  });

  it('returns to the first value when an edit is undone', () => {
    const before = assetDigest(spriteSlice());
    const edited = withSprite(flipFirstPixel);
    const back = withSprite((sprite) => flipFirstPixel(flipFirstPixel(sprite)));
    expect(assetDigest(edited)).not.toBe(before);
    expect(assetDigest(back)).toBe(before);
    expect(heartSprite().name).toBe('heart');
  });

  it('digests a palette and refuses a project', () => {
    expect(assetDigest(paletteSlice())).toBe(assetDigest(paletteSlice()));
    expect(encodePalette(paletteSlice(), null, WRITER_CLOCK).length).toBeGreaterThan(0);
    expect(() => assetDigest({ ...paletteSlice(), kind: 'project' })).toThrow();
  });
});
