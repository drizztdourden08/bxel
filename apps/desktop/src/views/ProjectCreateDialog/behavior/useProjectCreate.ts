/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { fileKit } from '../../../files/file-kit';
import { reasonOf } from '../../../files/reason-of';
import { createProject } from '../../../project/create-project';
import { PROJECT_TEXT } from '../../../project/project.constants';
import { useProjectStore } from '../../../stores/useProjectStore';
import type { ProjectCreateModel } from '../ProjectCreateDialog.type';
import { folderNameOf } from './folder-name-of';

const useProjectCreate = (): ProjectCreateModel => {
  const [name, setName] = useState('');
  const [folder, setFolder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const hide = useCallback(() => useProjectStore.getState().showDialog(false), []);

  const choose = useCallback(async (): Promise<void> => {
    try {
      const picked = await fileKit()?.documents.openFolder({ title: PROJECT_TEXT.pickTitle });
      if (picked === null || picked === undefined) return;
      setFolder(picked);
      setName((typed) => (typed.trim() === '' ? folderNameOf(picked) : typed));
      setError(null);
    } catch (failure) {
      setError(reasonOf(failure));
    }
  }, []);

  const create = useCallback(async (): Promise<void> => {
    if (folder === null || busy) return;
    setBusy(true);
    const outcome = await createProject(name.trim(), folder);
    setBusy(false);
    if (outcome?.ok) hide();
    else setError(outcome?.message ?? null);
  }, [busy, folder, hide, name]);

  const valid = folder !== null && name.trim() !== '' && !busy;
  return { name, folder, error, valid, setName, choose: () => void choose(), create: () => void create(), hide };
};

export { useProjectCreate };
