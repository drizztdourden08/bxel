/* @layer core @kind logic */
import { requireSprite, updateSprite, writableCel } from '@bxel/document';
import type { Draft, ResolvedCel, SpriteId } from '@bxel/document';
import type { Orientation } from '../transform/transform.type';
import { transformBuffer } from '../transform/transform-buffer';
import { reorientSprite } from './reorient-sprite';
import { uniqueCels } from './unique-cels';

const flipSprite = (draft: Draft, spriteId: SpriteId, cels: readonly ResolvedCel[], orientation: Orientation): void => {
  const sprite = requireSprite(draft.project, spriteId);
  const { width, height } = sprite;
  for (const { celId } of uniqueCels(cels)) {
    if (celId) {
      const pixels = writableCel(draft, spriteId, celId);
      pixels.set(transformBuffer({ pixels, width, height }, orientation).pixels);
    }
  }
  if (cels.length === sprite.layers.length * sprite.frames.length) {
    updateSprite(draft, spriteId, (current) => reorientSprite(current, orientation));
  }
};

export { flipSprite };
