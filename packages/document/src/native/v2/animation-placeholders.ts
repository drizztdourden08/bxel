/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import type { Animation } from '../../model/animation.type';
import type { BankId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import { placeholderSprite } from './placeholder-sprite';

const extentOf = (animation: Animation, spriteId: string): { width: number; height: number } => {
  const clips = animation.frames.flatMap((frame) => (frame.spriteId === spriteId && frame.clip ? [frame.clip] : []));
  return {
    width: Math.max(animation.width, ...clips.map((clip) => clip.x + clip.width)),
    height: Math.max(animation.height, ...clips.map((clip) => clip.y + clip.height)),
  };
};

const animationPlaceholders = (animation: Animation, missing: readonly AssetRef[], bankId: BankId): readonly Sprite[] =>
  missing.map((link) => placeholderSprite(link, extentOf(animation, link.id), bankId));

export { animationPlaceholders };
