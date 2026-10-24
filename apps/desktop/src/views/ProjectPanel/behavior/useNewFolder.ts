/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { newProjectFolder } from '../../../project/new-project-folder';
import type { FolderScope, FolderMakerState } from '../ProjectPanel.type';

const useNewFolder = ({ dir, refresh }: FolderScope): FolderMakerState => {
  const [makingFolder, setMaking] = useState(false);
  const [folderError, setError] = useState<string | null>(null);

  const startFolder = useCallback(() => setMaking(true), []);
  const stopFolder = useCallback(() => {
    setMaking(false);
    setError(null);
  }, []);

  const createFolder = useCallback(
    (typed: string): void => {
      if (dir === null) return;
      void newProjectFolder(dir, typed).then((outcome) => {
        setError(outcome.ok ? null : outcome.message);
        if (!outcome.ok) return;
        setMaking(false);
        refresh();
      });
    },
    [dir, refresh],
  );

  return { makingFolder, folderError, startFolder, stopFolder, createFolder };
};

export { useNewFolder };
