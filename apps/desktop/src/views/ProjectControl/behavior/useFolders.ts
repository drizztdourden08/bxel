/* @layer renderer-app @kind hook */
import type { FolderRole } from '@bxel/project';
import { useCallback, useState } from 'react';
import { focusedProject } from '../../../project-config/focused-project';
import { setRolePath } from '../../../project-config/set-role-path';
import { addLinkedFolder } from '../../../project/add-linked-folder';
import { removeLinkedFolder } from '../../../project/remove-linked-folder';
import type { ProjectOutcome } from '../../../project/project.type';
import type { FoldersModel } from '../ProjectControl.type';

const useFolders = (): FoldersModel => {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (task: () => Promise<ProjectOutcome | string | null>): Promise<void> => {
    setBusy(true);
    const outcome = await task();
    setBusy(false);
    if (typeof outcome === 'string') setError(outcome);
    else setError(outcome?.ok === false ? outcome.message : null);
  }, []);
  const add = useCallback(() => void run(addLinkedFolder), [run]);
  const remove = useCallback((folderId: string) => void run(() => removeLinkedFolder(folderId)), [run]);
  const setRole = useCallback(
    (folderId: string, role: FolderRole, path: string) =>
      void run(async () => {
        const focus = focusedProject();
        return focus ? setRolePath(focus, { folderId, role, path }) : null;
      }),
    [run],
  );
  return { error, busy, add, remove, setRole };
};

export { useFolders };
