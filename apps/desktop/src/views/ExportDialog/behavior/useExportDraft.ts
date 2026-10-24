/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useState } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { applyPatch } from '../../../export/apply-patch';
import type { ExportSettings } from '../../../export/export.type';
import { folderOf } from '../../../export/folder-of';
import { startSettings } from '../../../export/start-settings';
import type { AppSettings } from '../../../settings.type';
import { useFileStore } from '../../../stores/useFileStore';
import type { DraftModel } from '../ExportDialog.type';

const useExportDraft = (): DraftModel => {
  const { settings: app } = useSettings<AppSettings>();
  const view = useActiveDocument();
  const path = useFileStore((state) => (view ? state.paths[view.state.documentId] : undefined));
  const [settings, setSettings] = useState<ExportSettings>(() => startSettings(app.exportLast, path === undefined ? '' : folderOf(path)));
  const change = useCallback((patch: Partial<ExportSettings>) => setSettings((previous) => applyPatch(previous, patch)), []);
  return { settings, change, replace: setSettings };
};

export { useExportDraft };
