/* @layer renderer-app @kind logic */
import { animationCells } from '@bxel/document';
import type { Animation, Artwork, TagId } from '@bxel/document';
import { animationCellImages } from '../../../sheet/animation-cell-images';
import type { AnimationClip } from './animation-clip.type';
import { HELD } from './animation-clip.constants';

const buildClip = (artwork: Artwork, animation: Animation, tagId: TagId | null): AnimationClip => {
  const durations = new Map(animation.frames.map((frame) => [frame.id, frame.durationMs] as const));
  const cells = animationCells(animation, tagId);
  return animationCellImages(artwork, animation, tagId).map((image, index) => {
    const cell = cells[index];
    return { image, durationMs: (cell && durations.get(cell.frameId)) ?? 0 };
  });
};

const animationClip = (artwork: Artwork, animation: Animation, tagId: TagId | null): AnimationClip => {
  const held = HELD.get(animation);
  const fresh = held?.sprites === artwork.sprites && held.banks === artwork.banks ? held : { sprites: artwork.sprites, banks: artwork.banks, clips: new Map<string, AnimationClip>() };
  HELD.set(animation, fresh);
  const key = tagId ?? '';
  const known = fresh.clips.get(key);
  if (known) return known;
  const made = buildClip(artwork, animation, tagId);
  fresh.clips.set(key, made);
  return made;
};

export { animationClip };
