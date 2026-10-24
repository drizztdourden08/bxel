/* @layer renderer-app @kind logic */
import type { SortKey } from '../../../sheet-manager/manager.type';

const sortOrder = (key: SortKey | null, current: SortKey, down: boolean): 'ascending' | 'descending' | 'none' => {
  if (key === null || key !== current) return 'none';
  return down ? 'descending' : 'ascending';
};

export { sortOrder };
