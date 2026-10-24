/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { memoryOf } from '../../../asset-defaults/memory-of';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { initialForm } from '../../../new-sprite/initial-form';
import { newFormErrors } from '../../../new-sprite/new-form-errors';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreationForm, InFileOutcome } from '../../../new-sprite/new-sprite.type';
import { newSummary } from '../../../new-sprite/new-summary';
import { patchForm } from '../../../new-sprite/patch-form';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import type { CreateFormBase } from '../CreateDialog.type';

const useNewFormBase = (taken: readonly string[]): CreateFormBase => {
  const defaults = useEffectiveDefaults();
  const memory = useMemo(() => memoryOf(defaults), [defaults]);
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
      toast(NEW_TEXT.created(outcome.names), { variant: 'success' });
      useCreateDialogStore.getState().hide();
      return true;
    },
    [],
  );

  return { form, errors, summary, failure, update, settle };
};

export { useNewFormBase };
