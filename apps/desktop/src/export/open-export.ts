/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { usePendingStore } from '../stores/usePendingStore';
import { currentTab } from '../workspace/current-tab';
import { EXPORT_TEXT } from './export.constants';
import type { ExportKind, ExportSettings } from './export.type';
import { useExportStore } from './useExportStore';

const openExport = (kind?: ExportKind, settings?: Partial<ExportSettings>): void => {
  if (usePendingStore.getState().pending !== null) {
    toast(EXPORT_TEXT.previewOpen, { variant: 'info' });
    return;
  }
  const tab = kind === undefined ? currentTab() : null;
  const onAnimation = tab?.key.kind === 'animation';
  const shown = onAnimation ? 'animation' : kind;
  const chosen = onAnimation ? { animationId: tab.key.id } : settings;
  useExportStore.getState().show({ ...(shown === undefined ? {} : { kind: shown }), ...(chosen === undefined ? {} : { settings: chosen }) });
};

export { openExport };
