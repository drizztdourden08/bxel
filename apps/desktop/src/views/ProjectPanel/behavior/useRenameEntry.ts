/* @layer renderer-app @kind hook */
import type { ListedEntry } from '@bxel/project';
import { useCallback, useState } from 'react';
import { renameEntry } from '../../../project/rename-entry';
import type { FolderScope, RenameState } from '../ProjectPanel.type';

const useRenameEntry = ({ dir, refresh }: FolderScope): RenameState => {
  const [target, setTarget] = useState<ListedEntry | null>(null);
  const [renameError, setError] = useState<string | null>(null);

  const startRename = useCallback((entry: ListedEntry) => setTarget(entry), []);
  const stopRename = useCallback(() => {
    setTarget(null);
    setError(null);
  }, []);

  const rename = useCallback(
    (typed: string): void => {
      if (dir === null || target === null) return;
      void renameEntry({ dir, name: target.name, kind: target.kind === 'folder' ? 'folder' : 'file' }, typed).then((outcome) => {
        setError(outcome.ok ? null : outcome.message);
        if (!outcome.ok) return;
        setTarget(null);
        refresh();
      });
    },
    [dir, refresh, target],
  );

  return { renaming: target?.name ?? null, renameError, startRename, stopRename, rename };
};

export { useRenameEntry };
