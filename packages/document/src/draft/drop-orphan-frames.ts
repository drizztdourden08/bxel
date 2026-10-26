/* @layer core @kind logic */
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const dropOrphanFrames = (draft: Draft): number => {
  const used = new Set(draft.artwork.animations.flatMap((animation) => animation.frames.map((frame) => frame.spriteId)));
  const orphans = draft.artwork.sprites.filter((sprite) => sprite.role === 'frame' && !used.has(sprite.id));
  if (orphans.length === 0) return 0;
  const gone = new Set(orphans.map((sprite) => sprite.id));
  updateArtwork(draft, (artwork) => ({ ...artwork, sprites: artwork.sprites.filter((sprite) => !gone.has(sprite.id)) }));
  return orphans.length;
};

export { dropOrphanFrames };
