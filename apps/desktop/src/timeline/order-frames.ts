/* @layer renderer-app @kind logic */
import type { FrameId, TagDirection } from '@bxel/document';

const orderFrames = (ids: readonly FrameId[], direction: TagDirection): FrameId[] => {
  if (direction === 'reverse') return [...ids].reverse();
  if (direction === 'pingpong' && ids.length > 2) return [...ids, ...ids.slice(1, -1).reverse()];
  return [...ids];
};

export { orderFrames };
