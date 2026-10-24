/* @layer core @kind logic */
import { requireSprite, resizeSprite, trimPivot } from '@bxel/document';
import type { CelId, Draft, Rect, Slice, SpriteId } from '@bxel/document';
import { padBuffer } from '../region/pad-buffer';

const shiftRect = (rect: Rect, frame: Rect): Rect => ({ ...rect, x: rect.x - frame.x, y: rect.y - frame.y });

const shiftSlice = (slice: Slice, frame: Rect): Slice => ({
  ...slice,
  rect: shiftRect(slice.rect, frame),
  pivot: slice.pivot && trimPivot(slice.pivot, frame),
  center: slice.center && shiftRect(slice.center, frame),
});

const growSprite = (draft: Draft, spriteId: SpriteId, frame: Rect): void => {
  const sprite = requireSprite(draft.project, spriteId);
  const cels: Record<CelId, Uint8Array> = {};
  for (const cel of Object.values(sprite.cels)) {
    cels[cel.id] = padBuffer({ pixels: cel.pixels, width: sprite.width, height: sprite.height }, frame).pixels;
  }
  resizeSprite(draft, spriteId, {
    width: frame.width,
    height: frame.height,
    pivot: trimPivot(sprite.pivot, frame),
    slices: sprite.slices.map((slice) => shiftSlice(slice, frame)),
    cels,
  });
};

export { growSprite };
