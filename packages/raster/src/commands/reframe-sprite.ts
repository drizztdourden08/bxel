/* @layer core @kind logic */
import { addWarning, requireSprite, resizeSprite, trimPivot } from '@bxel/document';
import type { CelId, Draft, Pivot2, Rect, SpriteId } from '@bxel/document';
import { countOpaque } from '../region/count-opaque';
import { reframeBuffer } from '../region/reframe-buffer';
import { reframeSlices } from './reframe-slices';
import { SPRITE_CLIPPED } from './resize-anchor.constants';

const clampPivot = (pivot: Pivot2, frame: Rect): Pivot2 => ({
  x2: Math.min(2 * frame.width, Math.max(0, pivot.x2)),
  y2: Math.min(2 * frame.height, Math.max(0, pivot.y2)),
});

const reframeSprite = (draft: Draft, spriteId: SpriteId, frame: Rect): number => {
  const sprite = requireSprite(draft.artwork, spriteId);
  const cels: Record<CelId, Uint8Array> = {};
  let lost = 0;
  for (const cel of Object.values(sprite.cels)) {
    const source = { pixels: cel.pixels, width: sprite.width, height: sprite.height };
    lost += countOpaque(source, frame);
    cels[cel.id] = reframeBuffer(source, frame).pixels;
  }
  resizeSprite(draft, spriteId, {
    width: frame.width,
    height: frame.height,
    pivot: clampPivot(trimPivot(sprite.pivot, frame), frame),
    slices: reframeSlices(sprite.slices, frame),
    cels,
  });
  if (lost > 0) addWarning(draft, SPRITE_CLIPPED, `Sprite "${sprite.name}" lost ${lost} pixel(s) outside the new canvas.`);
  return lost;
};

export { reframeSprite };
