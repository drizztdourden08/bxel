/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { LOOP, PICKED, WHOLE } from '../sub-components/RangeSelect.constants';

const rangeValue = (looped: boolean, picked: boolean, tagId: TagId | null): string => {
  if (looped) return LOOP;
  if (picked) return PICKED;
  return tagId ?? WHOLE;
};

export { rangeValue };
