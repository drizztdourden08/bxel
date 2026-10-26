/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { ProjectRename } from '../ProjectManager.type';

const useProjectRename = (rename: (name: string) => Promise<string | null>): ProjectRename => {
  const [renaming, setRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const start = useCallback(() => setRenaming(true), []);
  const stop = useCallback(() => {
    setRenaming(false);
    setError(null);
  }, []);
  const submit = useCallback(
    (name: string): void => {
      void rename(name).then((failure) => {
        setError(failure);
        if (failure === null) setRenaming(false);
      });
    },
    [rename],
  );
  return { renaming, error, start, stop, submit };
};

export { useProjectRename };
