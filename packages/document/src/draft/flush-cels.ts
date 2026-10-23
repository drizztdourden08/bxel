/* @layer core @kind logic */
import type { Cel, Sprite } from '../model/sprite.type';
import { diffBounds } from '../pixels/diff-bounds';
import { readRect } from '../pixels/read-rect';
import { findSprite } from '../read/find-sprite';
import type { Draft } from './draft.type';

const flushCel = (draft: Draft, sprite: Sprite, cel: Cel): void => {
  const from = draft.baselines.get(cel.id) ?? findSprite(draft.base, sprite.id)?.cels[cel.id]?.pixels;
  if (!from || from === cel.pixels || from.length !== cel.pixels.length) return;
  const rect = diffBounds(from, cel.pixels, sprite.width);
  if (!rect) return;
  draft.ops.push({
    kind: 'cel-rect',
    spriteId: sprite.id,
    celId: cel.id,
    rect,
    before: readRect(from, sprite.width, rect),
    after: readRect(cel.pixels, sprite.width, rect),
  });
  draft.baselines.set(cel.id, cel.pixels.slice());
};

const flushCels = (draft: Draft): void => {
  for (const sprite of draft.project.sprites) {
    for (const cel of Object.values(sprite.cels)) flushCel(draft, sprite, cel);
  }
};

export { flushCels };
