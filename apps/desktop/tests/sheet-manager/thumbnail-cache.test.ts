/* @layer renderer-app @kind test */
import type { PaletteBank, Sprite } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { cachedThumbnail } from '../../src/views/EntryTile/behavior/cached-thumbnail';

const owner = () => {
  const made: unknown[] = [];
  const doc = {
    createElement: () => {
      const canvas = { width: 0, height: 0, getContext: () => ({ clearRect: () => undefined }) };
      made.push(canvas);
      return canvas;
    },
  };
  return { doc: doc as unknown as Document, made };
};

const sprite = (id: string): Sprite => ({ id, frames: [], width: 8, height: 8 }) as unknown as Sprite;
const bank = {} as PaletteBank;

describe('S2 the entry thumbnails are kept by sprite and revision', { tags: ['standard'] }, () => {
  it('draws a sprite once and gives the same picture while the sprite and bank are the same', () => {
    const { doc, made } = owner();
    const hero = sprite('hero');
    const first = cachedThumbnail(doc, bank, hero, 32);
    expect(cachedThumbnail(doc, bank, hero, 32)).toBe(first);
    expect(made).toHaveLength(1);
  });

  it('draws again when the sprite changes or the size does', () => {
    const { doc, made } = owner();
    const first = cachedThumbnail(doc, bank, sprite('mage'), 32);
    expect(cachedThumbnail(doc, bank, sprite('mage'), 32)).not.toBe(first);
    cachedThumbnail(doc, bank, sprite('mage'), 64);
    expect(made).toHaveLength(3);
  });
});
