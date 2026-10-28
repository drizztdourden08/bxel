/* @layer renderer-app @kind logic */
import { animationCells } from '@bxel/document';
import type { Animation, Artwork, PaletteBank, Sprite, TagId } from '@bxel/document';
import { animationCellImages } from '../../../sheet/animation-cell-images';
import type { FrameImage } from '../../../sheet/sheet.type';

interface AnimationClip {
  images: readonly FrameImage[];
  durations: readonly number[];
}

interface Held {
  sprites: readonly Sprite[];
  banks: readonly PaletteBank[];
  clips: Map<string, AnimationClip>;
}

const HELD = new WeakMap<Animation, Held>();

const buildClip = (artwork: Artwork, animation: Animation, tagId: TagId | null): AnimationClip => {
  const durations = new Map(animation.frames.map((frame) => [frame.id, frame.durationMs] as const));
  return {
    images: animationCellImages(artwork, animation, tagId),
    durations: animationCells(animation, tagId).map((cell) => durations.get(cell.frameId) ?? 0),
  };
};

const animationClip = (artwork: Artwork, animation: Animation, tagId: TagId | null): AnimationClip => {
  const held = HELD.get(animation);
  const fresh = held && held.sprites === artwork.sprites && held.banks === artwork.banks ? held : { sprites: artwork.sprites, banks: artwork.banks, clips: new Map<string, AnimationClip>() };
  HELD.set(animation, fresh);
  const key = tagId ?? '';
  const known = fresh.clips.get(key);
  if (known) return known;
  const made = buildClip(artwork, animation, tagId);
  fresh.clips.set(key, made);
  return made;
};

export type { AnimationClip };
export { animationClip };
