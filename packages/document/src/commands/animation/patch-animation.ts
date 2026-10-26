/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { Animation } from '../../model/animation.type';
import type { BankId } from '../../model/ids.type';
import { requireBank } from '../../read/require-bank';
import type { AnimationUpdateOptions } from '../../schema/animation-options.type';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { checkSize } from '../../validate/check-size';

const renamed = (draft: Draft, animation: Animation, requested: string | undefined): Animation => {
  if (requested === undefined) return animation;
  const name = checkName(requested);
  assertNameFree(
    draft.artwork.animations.filter((item) => item.id !== animation.id).map((item) => item.name),
    name,
  );
  return { ...animation, name };
};

const resized = (animation: Animation, options: AnimationUpdateOptions): Animation => {
  const width = options.width ?? animation.width;
  const height = options.height ?? animation.height;
  if (width === animation.width && height === animation.height) return animation;
  checkSize({ width, height });
  return { ...animation, width, height };
};

const rebanked = (draft: Draft, animation: Animation, bankId: string | undefined): Animation => {
  if (bankId === undefined || bankId === animation.bankId) return animation;
  requireBank(draft.artwork, bankId as BankId);
  return { ...animation, bankId: bankId as BankId };
};

const looped = (animation: Animation, options: AnimationUpdateOptions): Animation => {
  const given = [options.loopDirection, options.loopRepeat, options.directions, options.directionPattern, options.anchor];
  if (given.every((value) => value === undefined)) return animation;
  return {
    ...animation,
    loop: {
      direction: options.loopDirection ?? animation.loop.direction,
      repeat: options.loopRepeat ?? animation.loop.repeat,
    },
    directions: options.directions ?? animation.directions,
    directionPattern: options.directionPattern ?? animation.directionPattern,
    anchor: options.anchor ?? animation.anchor,
  };
};

const patchAnimation = (draft: Draft, animation: Animation, options: AnimationUpdateOptions): Animation =>
  looped(rebanked(draft, resized(renamed(draft, animation, options.name), options), options.bankId), options);

export { patchAnimation };
