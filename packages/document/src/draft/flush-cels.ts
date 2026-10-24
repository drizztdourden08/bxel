/* @layer core @kind logic */
import type { Cel, Sprite } from '../model/sprite.type';
import { diffBounds } from '../pixels/diff-bounds';
import { readRect } from '../pixels/read-rect';
import { findSprite } from '../read/find-sprite';
import type { Draft } from './draft.type';

const baselineOf = (draft: Draft, sprite: Sprite, cel: Cel): Uint8Array | null => {
  const prior = findSprite(draft.recorded, sprite.id);
  if (prior?.width !== sprite.width || prior.height !== sprite.height) return null;
  const from = draft.baselines.get(cel.id) ?? prior.cels[cel.id]?.pixels;
  if (!from || from === cel.pixels || from.length !== cel.pixels.length) return null;
  return from;
};

const flushCel = (draft: Draft, sprite: Sprite, cel: Cel, final: boolean): void => {
  const from = baselineOf(draft, sprite, cel);
  const rect = from ? diffBounds(from, cel.pixels, sprite.width) : null;
  if (!from || !rect) return;
  draft.ops.push({
    kind: 'cel-rect',
    spriteId: sprite.id,
    celId: cel.id,
    rect,
    before: readRect(from, sprite.width, rect),
    after: readRect(cel.pixels, sprite.width, rect),
  });
  if (!final) draft.baselines.set(cel.id, cel.pixels.slice());
};

const flushCels = (draft: Draft, final: boolean): void => {
  for (const sprite of draft.artwork.sprites) {
    for (const cel of Object.values(sprite.cels)) flushCel(draft, sprite, cel, final);
  }
};

export { flushCels };
