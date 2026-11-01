/* @layer tests @kind test */
import type { Artwork, SpriteId } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { brand } from './brand';
import { pixelEngine, scopeOf, stepOf } from './pixel-engine';
import { smallArtwork } from './small-artwork';
import { refusalOf } from './transform-checks';

const frame = brand<SpriteId>('spr_000070');

const framed = (): Artwork => {
  const base = smallArtwork();
  return { ...base, sprites: base.sprites.map((sprite) => ({ ...sprite, role: 'frame' as const })) };
};

describe('K1 frame sprites of an animation', { tags: ['critical'] }, () => {
  test('keep their size: resize and crop are refused', () => {
    const engine = pixelEngine(framed());
    const resize = refusalOf(engine, stepOf('sprite.resize', scopeOf([frame]), { width: 5, height: 4 }));
    expect(resize.code).toBe('INVALID_OPTION');
    expect(resize.message).toContain('frame of an animation');
    expect(refusalOf(engine, stepOf('sprite.crop', scopeOf([frame]), { x: 1, y: 0, width: 2, height: 2 })).code).toBe('INVALID_OPTION');
  });
});
