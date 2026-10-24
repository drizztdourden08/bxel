/* @layer renderer-app @kind logic */
import type { FrameId, Sprite, Tag, TagId } from '@bxel/document';
import { tagFrames } from './tag-frames';

const tagAt = (sprite: Sprite, frameId: FrameId, preferred: TagId | null): Tag | undefined => {
  const holds = (tag: Tag): boolean => tagFrames(sprite, tag).includes(frameId);
  const chosen = sprite.tags.find((tag) => tag.id === preferred);
  return chosen && holds(chosen) ? chosen : sprite.tags.find(holds);
};

export { tagAt };
