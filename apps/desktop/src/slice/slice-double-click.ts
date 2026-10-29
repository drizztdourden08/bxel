/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import { DOUBLE_CLICK_MS } from './slice.constants';

const last: { at: number; id: string | null } = { at: 0, id: null };

const sliceDoubleClick = (hit: Slice | null, time: number): boolean => {
  const again = hit !== null && last.id === hit.id && time - last.at <= DOUBLE_CLICK_MS;
  last.at = again ? 0 : time;
  last.id = hit && !again ? hit.id : null;
  return again;
};

export { sliceDoubleClick };
