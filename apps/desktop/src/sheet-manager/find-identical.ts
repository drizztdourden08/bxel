/* @layer renderer-app @kind logic */
import type { Sprite, SpriteId } from '@bxel/document';
import { canonicalBytes } from './canonical-bytes';
import { compareBytes } from './compare-bytes';
import { hashBytes } from './hash-bytes';
import { ALL_ORIENTATIONS, SAME_ORIENTATION } from './identical.constants';
import type { Twin } from './identical.type';

const keyOf = (sprite: Sprite, bytes: Uint8Array): string =>
  `${sprite.width}x${sprite.height}:${sprite.bankId}:${sprite.frames.length}:${hashBytes(bytes)}`;

const findIdentical = (sprites: readonly Sprite[], flips: boolean): SpriteId[][] => {
  const orientations = flips ? ALL_ORIENTATIONS : SAME_ORIENTATION;
  const buckets = new Map<string, Twin[]>();
  for (const sprite of sprites) {
    const bytes = canonicalBytes(sprite, orientations);
    const key = keyOf(sprite, bytes);
    const bucket = buckets.get(key) ?? [];
    const twin = bucket.find((each) => compareBytes(each.bytes, bytes) === 0);
    if (twin) twin.ids.push(sprite.id);
    else bucket.push({ bytes, ids: [sprite.id] });
    buckets.set(key, bucket);
  }
  return [...buckets.values()].flatMap((bucket) => bucket.filter((twin) => twin.ids.length > 1).map((twin) => twin.ids));
};

export { findIdentical };
