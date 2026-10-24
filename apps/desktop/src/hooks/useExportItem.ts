/* @layer renderer-app @kind hook */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import { useExportStore } from '../export/useExportStore';
import { FILE_COMMAND, FILE_TEXT } from '../files/files.constants';
import { usePendingStore } from '../stores/usePendingStore';
import { useActiveDocument } from './useActiveDocument';

const useExportItem = (): TitleBarButtonSpec => {
  const exporting = useExportStore((state) => state.running);
  const previewing = usePendingStore((state) => state.pending !== null);
  const view = useActiveDocument();
  return {
    kind: 'button',
    label: exporting ? FILE_TEXT.exportBusy : FILE_TEXT.exportReady,
    icon: 'pixel-export-image',
    command: FILE_COMMAND.export,
    disabled: view === null || previewing,
  };
};

export { useExportItem };
