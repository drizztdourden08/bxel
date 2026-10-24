/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { addLinkedFolder } from '../../../project/add-linked-folder';
import { removeLinkedFolder } from '../../../project/remove-linked-folder';
import type { OpenProject, ProjectOutcome } from '../../../project/project.type';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { ProjectSettingsModel } from '../ProjectSettingsDialog.type';

const useProjectSettings = (project: OpenProject): ProjectSettingsModel => {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const hide = useCallback(() => useProjectStore.getState().showSettings(false), []);

  const run = useCallback(async (task: () => Promise<ProjectOutcome | null>): Promise<void> => {
    setBusy(true);
    const outcome = await task();
    setBusy(false);
    setError(outcome?.ok === false ? outcome.message : null);
  }, []);

  const add = useCallback(() => void run(addLinkedFolder), [run]);
  const remove = useCallback((folderId: string) => void run(() => removeLinkedFolder(folderId)), [run]);
  return { project, error, busy, add, remove, hide };
};

export { useProjectSettings };
