/* @layer renderer-app @kind hook */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import { FILE_COMMAND, FILE_TEXT } from '../files/files.constants';
import { useFileStore } from '../stores/useFileStore';

const useExportItem = (): TitleBarButtonSpec => {
  const exporting = useFileStore((state) => state.busy === 'exporting');
  return {
    kind: 'button',
    label: exporting ? FILE_TEXT.exportBusy : FILE_TEXT.exportReady,
    icon: 'image',
    command: FILE_COMMAND.export,
  };
};

export { useExportItem };
