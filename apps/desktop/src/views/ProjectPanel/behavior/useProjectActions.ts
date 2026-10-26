/* @layer renderer-app @kind hook */
import { joinInside } from '@bxel/project';
import type { ListedEntry } from '@bxel/project';
import { useCallback, useState } from 'react';
import { runFileAction } from '../../../files/run-file-action';
import { newProjectFile } from '../../../project/new-project-file';
import { OPENED_KINDS } from '../ProjectPanel.constants';
import type { ProjectActions, ProjectActionsInput } from '../ProjectPanel.type';

const useProjectActions = ({ dir, enter, refresh }: ProjectActionsInput): ProjectActions => {
  const [naming, setNaming] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);

  const openEntry = useCallback(
    (entry: ListedEntry): void => {
      if (entry.kind === 'folder') return enter(entry.name);
      const path = dir === null || !OPENED_KINDS.includes(entry.kind) ? null : joinInside(dir, entry.name);
      if (path?.ok) void runFileAction({ kind: 'openPath', path: path.value });
      return undefined;
    },
    [dir, enter],
  );

  const createFile = useCallback(
    (name: string): void => {
      const where = target ?? dir;
      if (where === null) return;
      void newProjectFile(where, name).then((outcome) => {
        setNameError(outcome.ok ? null : outcome.message);
        if (!outcome.ok) return;
        setNaming(false);
        setTarget(null);
        refresh();
      });
    },
    [dir, target, refresh],
  );

  const startNaming = useCallback(() => {
    setTarget(null);
    setNaming(true);
  }, []);
  const startNamingIn = useCallback((where: string) => {
    setTarget(where);
    setNaming(true);
  }, []);
  const stopNaming = useCallback(() => {
    setNaming(false);
    setNameError(null);
    setTarget(null);
  }, []);
  return { naming, nameError, openEntry, startNaming, startNamingIn, stopNaming, createFile };
};

export { useProjectActions };
