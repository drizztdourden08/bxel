/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { holdFiles } from '../../../file-ops/hold-files';
import { moveEntries } from '../../../file-ops/move-entries';
import { pasteFiles } from '../../../file-ops/paste-files';
import { undoMove } from '../../../file-ops/undo-move';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import { moveTargets } from '../../../project-browser/move-targets';
import { pathOfEntry } from '../../../project-browser/path-of-entry';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useMoveToStore } from '../../../stores/useMoveToStore';
import type { BrowserActions } from '../ProjectBrowser.type';

type FileMoveActions = Pick<BrowserActions, 'moveInto' | 'moveTo' | 'cut' | 'copy' | 'paste' | 'undoMove'>;

const pathsOf = (entries: readonly BrowserEntry[]): string[] => entries.map(pathOfEntry).filter((path) => path !== '');

const useFileMoveActions = (model: BrowserModel): FileMoveActions => {
  const { entries, folder, roots, folderPaths } = model;
  return useMemo(
    () => ({
      moveInto: (ids, target) => {
        const wanted = new Set(ids);
        void moveEntries(pathsOf(entries.filter((entry) => wanted.has(entry.id))), target);
      },
      moveTo: (picked) => {
        const paths = pathsOf(picked);
        if (paths.length > 0) useMoveToStore.getState().show({ paths, targets: moveTargets(roots, folderPaths, paths) });
      },
      cut: (picked) => holdFiles(pathsOf(picked), true),
      copy: (picked) => holdFiles(pathsOf(picked), false),
      paste: () => {
        if (folder !== null) void pasteFiles(folder);
      },
      undoMove: () => void undoMove(),
    }),
    [entries, folder, roots, folderPaths],
  );
};

export { useFileMoveActions };
