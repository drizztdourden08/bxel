/* @layer renderer-app @kind hook */
import { joinInside } from '@bxel/project';
import type { ListedEntry } from '@bxel/project';
import { useCallback, useState } from 'react';
import { runFileAction } from '../../../files/run-file-action';
import { newProjectFile } from '../../../project/new-project-file';
import type { ProjectActions, ProjectActionsInput } from '../ProjectPanel.type';

const useProjectActions = ({ dir, enter, refresh }: ProjectActionsInput): ProjectActions => {
  const [naming, setNaming] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const openEntry = useCallback(
    (entry: ListedEntry): void => {
      if (entry.kind === 'folder') return enter(entry.name);
      const path = dir === null || entry.kind !== 'bxel' ? null : joinInside(dir, entry.name);
      if (path?.ok) void runFileAction({ kind: 'openPath', path: path.value });
      return undefined;
    },
    [dir, enter],
  );

  const createFile = useCallback(
    (name: string): void => {
      if (dir === null) return;
      void newProjectFile(dir, name).then((outcome) => {
        setNameError(outcome.ok ? null : outcome.message);
        if (!outcome.ok) return;
        setNaming(false);
        refresh();
      });
    },
    [dir, refresh],
  );

  const startNaming = useCallback(() => setNaming(true), []);
  const stopNaming = useCallback(() => {
    setNaming(false);
    setNameError(null);
  }, []);
  return { naming, nameError, openEntry, startNaming, stopNaming, createFile };
};

export { useProjectActions };
