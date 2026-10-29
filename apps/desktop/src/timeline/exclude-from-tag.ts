/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { setTagSpan } from './set-tag-span';
import { tagBounds } from './tag-bounds';

const excludeFromTag = (tagId: TagId): boolean => {
  const range = tagBounds(tagId);
  if (range === null) return false;
  if (range.low <= range.start && range.high < range.end) return setTagSpan(tagId, range.high + 1, range.end);
  if (range.high >= range.end && range.low > range.start) return setTagSpan(tagId, range.start, range.low - 1);
  return false;
};

export { excludeFromTag };
