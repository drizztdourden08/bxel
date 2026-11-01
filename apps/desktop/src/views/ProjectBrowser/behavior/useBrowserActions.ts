/* @layer renderer-app @kind hook */
import { nav } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { copyPath } from '../../../asset-list/copy-path';
import { duplicateRow } from '../../../asset-list/duplicate-row';
import { openRow } from '../../../asset-list/open-row';
import { openRowBackground } from '../../../asset-list/open-row-background';
import { revealRow } from '../../../asset-list/reveal-row';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import { pathOfEntry } from '../../../project-browser/path-of-entry';
import type { BrowserEntry, FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { openManyProperties } from '../../../properties-subject/open-many-properties';
import { openProperties } from '../../../properties-subject/open-properties';
import { startNewAsset } from '../../../project/start-new-asset';
import type { BrowserActions, BrowserActionState } from '../ProjectBrowser.type';
import { trashSelection } from './trash-selection';
import { useFileMoveActions } from './useFileMoveActions';
import { useImportActions } from './useImportActions';
import { useOrganiseActions } from './useOrganiseActions';
import { useRenameFlow } from './useRenameFlow';

const filesOf = (entries: readonly BrowserEntry[]): FileEntry[] => entries.filter((entry): entry is FileEntry => entry.kind === 'file');

const openEntry = (entry: BrowserEntry): void => {
  if (entry.kind === 'folder') {
    useBrowserStore.getState().goTo(entry.path);
    return;
  }
  openRow(entry.row);
  nav.close();
};

const useBrowserActions = (model: BrowserModel): BrowserActionState => {
  const rename = useRenameFlow(model.folder);
  const imports = useImportActions();
  const organise = useOrganiseActions();
  const moves = useFileMoveActions(model);
  const { folder } = model;

  const actions = useMemo<BrowserActions>(
    () => ({
      open: openEntry,
      openBackground: (entry) => {
        if (entry.kind === 'file') openRowBackground(entry.row);
      },
      openAll: (picked) => {
        for (const entry of filesOf(picked)) openRow(entry.row);
        if (filesOf(picked).length > 0) nav.close();
      },
      properties: (picked) => {
        const [first] = picked;
        if (picked.length > 1) openManyProperties(picked);
        else if (first?.kind === 'file') openProperties({ path: first.row.path === '' ? null : first.row.path, key: first.key });
      },
      startRename: rename.startRename,
      commitRename: rename.commitRename,
      cancelRename: rename.cancelRename,
      newFolder: rename.newFolder,
      newAsset: (kind) => {
        nav.close();
        startNewAsset(kind, folder ?? undefined);
      },
      trash: trashSelection,
      duplicate: (picked) => {
        for (const entry of filesOf(picked)) duplicateRow(entry.row);
      },
      reveal: (entry) => revealRow({ path: pathOfEntry(entry) }),
      copyPath: (entry) => void copyPath(pathOfEntry(entry)),
      ...organise,
      ...moves,
      importImage: imports.importImage,
      importPalette: imports.importPalette,
      dropFiles: imports.dropFiles,
      filterBy: (text) => useBrowserStore.getState().setQuery(text),
    }),
    [rename.startRename, rename.commitRename, rename.cancelRename, rename.newFolder, imports.importImage, imports.importPalette, imports.dropFiles, organise, moves, folder],
  );

  return { actions, renaming: rename.renaming, renameError: rename.renameError };
};

export { useBrowserActions };
