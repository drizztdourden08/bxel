/* @layer renderer-app @kind hook */
import { useState } from 'react';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import type { FormModel } from '../TilemapDialog.type';

const useDialogForm = <T extends object>(start: () => T, submit: (form: T) => string | null): FormModel<T> => {
  const [form, setForm] = useState<T>(start);
  const [failure, setFailure] = useState<string | null>(null);
  const hide = useTilemapDialogStore((state) => state.hide);
  const update = (patch: Partial<T>): void => setForm((previous) => ({ ...previous, ...patch }));
  const create = (): void => {
    const error = submit(form);
    setFailure(error);
    if (error === null) hide();
  };
  return { form, failure, update, create };
};

export { useDialogForm };
