/* @layer renderer-app @kind hook */
import type { ListedEntry } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { PROJECT_TEXT } from '../../../project/project.constants';
import { trashEntry } from '../../../project/trash-entry';
import type { EntryActions, FolderScope } from '../ProjectPanel.type';
import { useNewFolder } from './useNewFolder';
import { useRenameEntry } from './useRenameEntry';

const useEntryActions = (scope: FolderScope): EntryActions => {
  const { dir, refresh } = scope;
  const renames = useRenameEntry(scope);
  const folders = useNewFolder(scope);

  const trash = useCallback(
    (entry: ListedEntry): void => {
      if (dir === null) return;
      void trashEntry({ dir, name: entry.name, kind: entry.kind === 'folder' ? 'folder' : 'file' }).then((outcome) => {
        if (outcome === null) return;
        if (outcome.ok) refresh();
        else toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
      });
    },
    [dir, refresh],
  );

  return { ...renames, ...folders, trash };
};

export { useEntryActions };
