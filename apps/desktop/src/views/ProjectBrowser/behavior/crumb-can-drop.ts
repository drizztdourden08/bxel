/* @layer renderer-app @kind logic */
import { crumbDropTarget } from './crumb-drop-target';
import type { CrumbDropState } from './useCrumbDrops.type';
import type { FolderDropPayload } from './useFolderDrop.type';

const crumbCanDrop = (state: CrumbDropState, id: string, payload: FolderDropPayload): boolean =>
  crumbDropTarget(state, id) !== null && ('files' in payload || payload.every((asset) => asset.origin === undefined));

export { crumbCanDrop };
