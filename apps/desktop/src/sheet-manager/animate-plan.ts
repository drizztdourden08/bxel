/* @layer renderer-app @kind logic */
import { MAX_ANIMATION_FRAMES } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { nameError } from '../sprite-name/name-error';
import { COMPOSE_TEXT } from './compose-text.constants';
import type { AnimatePlan, AnimateSpec } from './compose.type';

const blockerOf = (sprites: readonly Sprite[], name: string, taken: readonly string[]): string | null => {
  if (sprites.length < 1) return COMPOSE_TEXT.needOne;
  if (sprites.length > MAX_ANIMATION_FRAMES) return COMPOSE_TEXT.tooMany(MAX_ANIMATION_FRAMES);
  if (new Set(sprites.map((sprite) => sprite.bankId)).size > 1) return COMPOSE_TEXT.mixedBanks;
  return nameError(name, taken);
};

const animatePlan = (sprites: readonly Sprite[], spec: AnimateSpec, taken: readonly string[]): AnimatePlan => {
  const width = Math.max(0, ...sprites.map((sprite) => sprite.width));
  const height = Math.max(0, ...sprites.map((sprite) => sprite.height));
  const name = spec.name.trim() === '' ? (sprites[0]?.name ?? '') : spec.name.trim();
  return {
    width,
    height,
    frames: sprites.length,
    mixed: sprites.some((sprite) => sprite.width !== width || sprite.height !== height),
    name,
    blocker: blockerOf(sprites, name, taken),
  };
};

export { animatePlan };
