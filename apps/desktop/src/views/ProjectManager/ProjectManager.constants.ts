/* @layer renderer-app @kind constants */
import type { DiskState } from '../../project-manager/project-manager.type';
import type { AssetsModel } from '../ProjectPanel/sub-components/AssetsView/AssetsView.type';

const IDLE_DISK: DiskState = { status: 'idle' };

const DO_NOTHING = (): void => undefined;

const READ_ONLY_ACTIONS: Pick<
  AssetsModel,
  'copyForSheet' | 'duplicate' | 'exportRow' | 'open' | 'rename' | 'reveal' | 'showUsers' | 'startRename' | 'stopRename' | 'trash'
> = {
  open: DO_NOTHING,
  startRename: DO_NOTHING,
  stopRename: DO_NOTHING,
  rename: DO_NOTHING,
  reveal: DO_NOTHING,
  duplicate: DO_NOTHING,
  trash: DO_NOTHING,
  copyForSheet: DO_NOTHING,
  exportRow: DO_NOTHING,
  showUsers: DO_NOTHING,
};

export { IDLE_DISK, READ_ONLY_ACTIONS };
