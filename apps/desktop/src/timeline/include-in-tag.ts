/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { setTagSpan } from './set-tag-span';
import { tagBounds } from './tag-bounds';

const includeInTag = (tagId: TagId): boolean => {
  const range = tagBounds(tagId);
  return range !== null && setTagSpan(tagId, Math.min(range.start, range.low), Math.max(range.end, range.high));
};

export { includeInTag };
