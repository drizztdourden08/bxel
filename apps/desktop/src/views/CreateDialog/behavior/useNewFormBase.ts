/* @layer renderer-app @kind hook */
import { toast, useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { formMemory } from '../../../new-sprite/form-memory';
import { initialForm } from '../../../new-sprite/initial-form';
import { newFormErrors } from '../../../new-sprite/new-form-errors';
import { NEW_MEMORY_DEFAULT, NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreationForm, InFileOutcome } from '../../../new-sprite/new-sprite.type';
import { newSummary } from '../../../new-sprite/new-summary';
import { patchForm } from '../../../new-sprite/patch-form';
import type { AppSettings } from '../../../settings.type';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import type { CreateFormBase } from '../CreateDialog.type';

const useNewFormBase = (taken: readonly string[]): CreateFormBase => {
  const { settings, patch } = useSettings<AppSettings>();
  const memory = useMemo(() => ({ ...NEW_MEMORY_DEFAULT, ...settings.newSprite }), [settings.newSprite]);
  const [form, setForm] = useState<CreationForm>(() => initialForm(memory, taken));
  const [failure, setFailure] = useState<string | null>(null);
  const errors = useMemo(() => newFormErrors(form, taken), [form, taken]);
  const summary = useMemo(() => newSummary(form), [form]);

  const update = useCallback((change: Partial<CreationForm>): void => {
    setFailure(null);
    setForm((current) => patchForm(current, change));
  }, []);

  const settle = useCallback(
    (outcome: InFileOutcome): boolean => {
      if (!outcome.ok) {
        setFailure(NEW_TEXT.failed(outcome.message));
        return false;
      }
      patch({ newSprite: formMemory(form, memory) });
      toast(NEW_TEXT.created(outcome.names), { variant: 'success' });
      useCreateDialogStore.getState().hide();
      return true;
    },
    [form, memory, patch],
  );

  return { form, errors, summary, failure, update, settle };
};

export { useNewFormBase };
