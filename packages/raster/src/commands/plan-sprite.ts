/* @layer core @kind logic */
import { requireSprite } from '@bxel/document';
import type { Project, SpriteId } from '@bxel/document';
import { fullMask } from '../selection/full-mask';
import { maskBounds } from '../selection/mask-bounds';
import type { ResampleSpec, SpritePlan } from './resample.type';

const planSprite = (project: Project, spriteId: SpriteId, spec: ResampleSpec): SpritePlan => {
  const sprite = requireSprite(project, spriteId);
  const mask = spec.mask ?? fullMask(sprite);
  const box = maskBounds(mask);
  const pivot = spec.pivot ?? sprite.pivot;
  const view = { mask, box: box ?? { x: 0, y: 0, width: 0, height: 0 }, pivot };
  const size = { width: sprite.width, height: sprite.height };
  return { spriteId, size, view, area: box ? spec.mover(view).area : null };
};

export { planSprite };
