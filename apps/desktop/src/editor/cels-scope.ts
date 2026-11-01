/* @layer renderer-app @kind logic */
import { findSprite, nameKey } from '@bxel/document';
import type { AnimFrameId, Artwork, SpriteId, TargetScope } from '@bxel/document';
import type { EditorTarget } from './editor.type';

const selectedSprites = (target: EditorTarget, artwork: Artwork, picked: readonly AnimFrameId[]): SpriteId[] => {
  const context = target.animation;
  if (!context) return [];
  const key = nameKey(target.layer.name);
  const ids = context.animation.frames
    .filter((frame) => picked.includes(frame.id))
    .flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId]));
  return [...new Set(ids)].filter((id) => findSprite(artwork, id)?.layers.some((layer) => nameKey(layer.name) === key));
};

const celsScope = (target: EditorTarget, artwork: Artwork, picked: readonly AnimFrameId[]): TargetScope | null => {
  const sprites = selectedSprites(target, artwork, picked);
  if (sprites.length < 2 || !sprites.includes(target.sprite.id)) return null;
  return {
    sprites,
    layers: { by: 'names', names: [target.layer.name] },
    frames: { by: 'range', from: 0, to: 0 },
  };
};

export { celsScope };
