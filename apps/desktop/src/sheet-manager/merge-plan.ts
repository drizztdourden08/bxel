/* @layer renderer-app @kind logic */
import { MAX_TARGET_SPRITES } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { COMPOSE_TEXT } from './compose-text.constants';
import type { MergePlan } from './compose.type';

const blockerOf = (sprites: readonly Sprite[]): string | null => {
  if (sprites.length < 2) return COMPOSE_TEXT.needTwo;
  if (sprites.length > MAX_TARGET_SPRITES) return COMPOSE_TEXT.tooMany(MAX_TARGET_SPRITES);
  return new Set(sprites.map((sprite) => sprite.bankId)).size > 1 ? COMPOSE_TEXT.mixedBanks : null;
};

const mergePlan = (sprites: readonly Sprite[]): MergePlan => {
  const width = Math.max(0, ...sprites.map((sprite) => sprite.width));
  const height = Math.max(0, ...sprites.map((sprite) => sprite.height));
  return {
    width,
    height,
    frames: sprites.reduce((sum, sprite) => sum + sprite.frames.length, 0),
    mixed: sprites.some((sprite) => sprite.width !== width || sprite.height !== height),
    blocker: blockerOf(sprites),
  };
};

export { mergePlan };
