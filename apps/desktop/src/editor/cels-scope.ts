/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import type { AnimFrameId, SpriteId, TargetScope } from '@bxel/document';
import type { CelsArtwork, CelsTarget } from './cels-scope.type';

const selectedSprites = (target: CelsTarget, artwork: CelsArtwork, picked: readonly AnimFrameId[]): SpriteId[] => {
  const context = target.animation;
  if (!context) return [];
  const key = nameKey(target.layer.name);
  const ids = context.animation.frames
    .filter((frame) => picked.includes(frame.id))
    .flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId]));
  const holdsLayer = (id: SpriteId): boolean => artwork.sprites.find((sprite) => sprite.id === id)?.layers.some((layer) => nameKey(layer.name) === key) ?? false;
  return [...new Set(ids)].filter(holdsLayer);
};

const celsScope = (target: CelsTarget, artwork: CelsArtwork, picked: readonly AnimFrameId[]): TargetScope | null => {
  const sprites = selectedSprites(target, artwork, picked);
  if (sprites.length < 2 || !sprites.includes(target.sprite.id)) return null;
  return {
    sprites,
    layers: { by: 'names', names: [target.layer.name] },
    frames: { by: 'range', from: 0, to: 0 },
  };
};

export { celsScope };
