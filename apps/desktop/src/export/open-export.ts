/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { usePendingStore } from '../stores/usePendingStore';
import { EXPORT_TEXT } from './export.constants';
import type { ExportKind, ExportSettings } from './export.type';
import { useExportStore } from './useExportStore';

const openExport = (kind?: ExportKind, settings?: Partial<ExportSettings>): void => {
  if (usePendingStore.getState().pending !== null) {
    toast(EXPORT_TEXT.previewOpen, { variant: 'info' });
    return;
  }
  useExportStore.getState().show({ ...(kind === undefined ? {} : { kind }), ...(settings === undefined ? {} : { settings }) });
};

export { openExport };
