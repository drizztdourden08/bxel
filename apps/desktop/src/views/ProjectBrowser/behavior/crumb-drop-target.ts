/* @layer renderer-app @kind logic */
import { crumbPath } from './crumb-path';
import type { CrumbDropState } from './useCrumbDrops.type';

const crumbDropTarget = (state: CrumbDropState, id: string): string | null => {
  const path = crumbPath(id);
  return path !== null && state.model.editable ? path : null;
};

export { crumbDropTarget };
