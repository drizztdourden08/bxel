/* @layer renderer-app @kind hook */
import type { OpenProject } from '../../../project/project.type';
import type { DiskState } from '../../../project-manager/project-manager.type';
import { useAssetsView } from '../../ProjectPanel/sub-components/AssetsView/behavior/useAssetsView';
import type { ManagerAssets } from '../ProjectManager.type';
import { useDiskAssets } from './useDiskAssets';

const useManagerAssets = (open: OpenProject | null, disk: DiskState, search: string): ManagerAssets => {
  const live = useAssetsView(open, search);
  const stored = useDiskAssets(disk.status === 'ready' ? disk.project : null, search);
  return open ? { assets: live, editable: true } : { assets: stored, editable: false };
};

export { useManagerAssets };
