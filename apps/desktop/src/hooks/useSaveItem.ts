/* @layer renderer-app @kind hook */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import { FILE_COMMAND } from '../files/files.constants';
import { saveLabel } from '../files/save-label';
import { useFileStore } from '../stores/useFileStore';
import { useActiveDocument } from './useActiveDocument';

const useSaveItem = (): TitleBarButtonSpec => {
  const view = useActiveDocument();
  const busy = useFileStore((state) => state.busy);
  const path = useFileStore((state) => (view ? state.paths[view.state.documentId] : undefined));
  const upToDate = view !== null && view.clean && path !== undefined && !view.state.readOnly;
  return { kind: 'button', label: saveLabel(busy, upToDate), icon: 'save', command: FILE_COMMAND.save, disabled: view === null || upToDate };
};

export { useSaveItem };
