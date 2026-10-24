/* @layer core @kind logic */
import type { Artwork } from '../../model/artwork.type';
import type { FrameId, SpriteId } from '../../model/ids.type';
import type { FrameRef } from '../../schema/command-options.type';
import { pickFrames } from '../frame/pick-frames';

const resolveFrameId = ({
  artwork,
  spriteId,
  ref,
  path,
  fallback,
}: {
  artwork: Artwork;
  spriteId: SpriteId;
  ref: FrameRef | undefined;
  path: string;
  fallback: FrameId;
}): FrameId => {
  if (!ref) return fallback;
  return pickFrames(artwork, [spriteId], ref, path)[0]?.frame.id ?? fallback;
};

export { resolveFrameId };
