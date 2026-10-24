/* @layer renderer-app @kind hook */
import type { SpriteId } from '@bxel/document';
import { getPlatform, useSettings } from '@drizztdourden08/brock-react';
import { currentPick } from '../../../editor/current-pick';
import { folderOf } from '../../../export/folder-of';
import { joinPath } from '../../../export/join-path';
import { safeName } from '../../../export/safe-name';
import { startExport } from '../../../export/start-export';
import { useExportStore } from '../../../export/useExportStore';
import { PNG_FILTERS } from '../../../files/files.constants';
import { fileName } from '../../../files/file-name';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import type { AppSettings } from '../../../settings.type';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { ActionsModel, DraftModel } from '../ExportDialog.type';

const useExportActions = ({ settings, change }: DraftModel, selectedIds: readonly SpriteId[], firstName: string): ActionsModel => {
  const { patch } = useSettings<AppSettings>();
  const state = useActiveDocument()?.state;
  const hide = useExportStore((store) => store.hide);
  const run = (): void => {
    if (!state) return;
    patch({ exportLast: { ...settings, approved: false } });
    hide();
    void startExport({ frozen: { revision: state.revision, artwork: state.artwork }, settings, selectedIds, title: state.artwork.name, current: currentPick() });
  };
  const browse = (): void => {
    const documents = getPlatform().documents;
    const name = safeName(settings.fileName) || firstName;
    const defaultPath = settings.folder === '' ? name : joinPath(settings.folder, name);
    void documents?.saveAs({ title: EXPORT_DIALOG_TEXT.browseTitle, defaultPath, filters: PNG_FILTERS }).then((path) => {
      if (path !== null) change({ folder: folderOf(path), fileName: safeName(fileName(path)) });
    });
  };
  return { run, browse };
};

export { useExportActions };
