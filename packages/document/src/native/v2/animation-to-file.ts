/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import { animationNeeds } from './animation-needs';
import type { AnimationEncoding } from './animation-file.type';
import { requireLinks } from './link-needs';
import { spriteShell } from './sprite-shell';

const animationToFile = (slice: AssetSlice): AnimationEncoding => {
  const { animations = [], sprites = [], banks = [], presets = [] } = slice.artwork;
  const [animation] = animations;
  if (animations.length !== 1 || !animation) throw new Error('An animation file holds exactly one animation.');
  const palette = banks.find((bank) => bank.id === animation.bankId);
  if (!palette) throw new Error(`An animation file needs a copy of its palette ${animation.bankId}.`);
  const used = new Set(animation.frames.map((frame) => frame.spriteId));
  const owned = sprites.filter((sprite) => sprite.role === 'frame' && used.has(sprite.id));
  requireLinks(animationNeeds(animation, new Set(owned.map((sprite) => sprite.id))), slice.links, 'An animation file');
  return { file: { animation, sprites: owned.map(spriteShell), palette, presets }, sprites: owned };
};

export { animationToFile };
