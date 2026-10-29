/* @layer core @kind logic */
import type { AnimFrame, AnimTag } from '../model/animation.type';
import { framePositions } from './frame-positions';
import { mapStable } from './map-stable';
import { orderSpan } from './order-span';

const orderAnimTags = (tags: readonly AnimTag[], frames: readonly AnimFrame[]): readonly AnimTag[] => {
  const position = framePositions(frames);
  return mapStable(tags, (tag) => (tag.kind === 'mirror' ? tag : orderSpan(tag, position)));
};

export { orderAnimTags };
