/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { usePendingStore } from '../stores/usePendingStore';
import { EXPORT_TEXT } from './export.constants';
import { useExportStore } from './useExportStore';

const openExport = (): void => {
  if (usePendingStore.getState().pending !== null) {
    toast(EXPORT_TEXT.previewOpen, { variant: 'info' });
    return;
  }
  useExportStore.getState().show();
};

export { openExport };
