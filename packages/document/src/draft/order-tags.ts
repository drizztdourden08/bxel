/* @layer core @kind logic */
import type { Frame, Tag } from '../model/sprite.type';
import { framePositions } from './frame-positions';
import { mapStable } from './map-stable';
import { orderSpan } from './order-span';

const orderTags = (tags: readonly Tag[], frames: readonly Frame[]): readonly Tag[] => {
  const position = framePositions(frames);
  return mapStable(tags, (tag) => orderSpan(tag, position));
};

export { orderTags };
