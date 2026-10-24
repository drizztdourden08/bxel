/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { createNewFile } from '../../../new-sprite/create-new-file';
import { hasErrors } from '../../../new-sprite/has-errors';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { focusDocument } from '../../../transactions/focus-document';
import { NO_NAMES } from '../CreateDialog.constants';
import type { CreateFormState } from '../CreateDialog.type';
import { useNewFormBase } from './useNewFormBase';

const useNewFile = (): CreateFormState => {
  const { form, errors, summary, failure, update, settle } = useNewFormBase(NO_NAMES);

  const create = useCallback((): void => {
    const outcome = createNewFile(useDocumentStore.getState().host, form);
    if (settle(outcome) && outcome.ok) focusDocument(outcome.documentId);
  }, [form, settle]);

  return { form, errors, summary, failure, valid: !hasErrors(errors), update, create };
};

export { useNewFile };
