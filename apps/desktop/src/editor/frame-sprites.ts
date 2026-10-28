/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import type { EditorTarget } from './editor.type';

/** The sprites that the frames of the open animation show, each once. */
const frameSprites = (target: EditorTarget): Sprite[] => {
  const artwork = currentArtwork();
  if (!target.animation || !artwork) return [target.sprite];
  const ids = new Set(target.animation.animation.frames.flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId])));
  return [...ids].flatMap((id) => findSprite(artwork, id) ?? []);
};

export { frameSprites };
