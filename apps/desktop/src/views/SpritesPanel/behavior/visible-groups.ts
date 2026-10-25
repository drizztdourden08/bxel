/* @layer renderer-app @kind logic */
import type { FolderGroup } from '../../../sheet-manager/folders.type';

const visibleGroups = (groups: readonly FolderGroup[]): FolderGroup[] => groups.filter((group) => !group.hidden);

export { visibleGroups };
