/* @layer core @kind logic */
import { requireSprite, resizeSprite } from '@bxel/document';
import type { CelId, Draft, SpriteId } from '@bxel/document';
import type { Orientation } from '../transform/transform.type';
import { transformBuffer } from '../transform/transform-buffer';
import { reorientSprite } from './reorient-sprite';

const turnSprite = (draft: Draft, spriteId: SpriteId, orientation: Orientation): void => {
  const sprite = requireSprite(draft.artwork, spriteId);
  const { width, height } = sprite;
  const cels: Record<CelId, Uint8Array> = {};
  for (const cel of Object.values(sprite.cels)) {
    cels[cel.id] = transformBuffer({ pixels: cel.pixels, width, height }, orientation).pixels;
  }
  const turned = reorientSprite(sprite, orientation);
  resizeSprite(draft, spriteId, {
    width: turned.width,
    height: turned.height,
    pivot: turned.pivot,
    slices: turned.slices,
    cels,
  });
};

export { turnSprite };
