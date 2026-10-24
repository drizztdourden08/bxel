/* @layer renderer-app @kind hook */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import { FILE_COMMAND } from '../files/files.constants';
import { saveLabel } from '../files/save-label';
import { useFileStore } from '../stores/useFileStore';
import { useActiveAsset } from './useActiveAsset';
import { useActiveDocument } from './useActiveDocument';

const useSaveItem = (): TitleBarButtonSpec => {
  const view = useActiveDocument();
  const asset = useActiveAsset();
  const busy = useFileStore((state) => state.busy);
  const upToDate = view !== null && asset !== null && !asset.dirty && asset.path !== undefined && !view.state.readOnly;
  return { kind: 'button', label: saveLabel(busy, upToDate), icon: 'pixel-save-file', command: FILE_COMMAND.save, disabled: view === null || upToDate };
};

export { useSaveItem };
