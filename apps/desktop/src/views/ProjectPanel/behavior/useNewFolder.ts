/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { newProjectFolder } from '../../../project/new-project-folder';
import type { FolderScope, FolderMakerState } from '../ProjectPanel.type';

const useNewFolder = ({ dir, refresh }: FolderScope): FolderMakerState => {
  const [makingFolder, setMaking] = useState(false);
  const [folderError, setError] = useState<string | null>(null);
  const [parent, setParent] = useState<string | null>(null);

  const startFolder = useCallback(() => {
    setParent(null);
    setMaking(true);
  }, []);
  const startFolderIn = useCallback((where: string) => {
    setParent(where);
    setMaking(true);
  }, []);
  const stopFolder = useCallback(() => {
    setMaking(false);
    setError(null);
    setParent(null);
  }, []);

  const createFolder = useCallback(
    (typed: string): void => {
      const where = parent ?? dir;
      if (where === null) return;
      void newProjectFolder(where, typed).then((outcome) => {
        setError(outcome.ok ? null : outcome.message);
        if (!outcome.ok) return;
        setMaking(false);
        setParent(null);
        refresh();
      });
    },
    [dir, parent, refresh],
  );

  return { makingFolder, folderError, startFolder, startFolderIn, stopFolder, createFolder };
};

export { useNewFolder };
