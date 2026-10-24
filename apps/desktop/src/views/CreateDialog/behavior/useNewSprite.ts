/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { createSpriteInFile } from '../../../new-sprite/create-sprite-in-file';
import { hasErrors } from '../../../new-sprite/has-errors';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { CreateFormState } from '../CreateDialog.type';
import { useNewFormBase } from './useNewFormBase';

const useNewSprite = (): CreateFormState => {
  const view = useActiveDocument();
  const taken = useMemo(() => view?.state.artwork.sprites.map((sprite) => sprite.name) ?? [], [view]);
  const { form, errors, summary, failure, update, settle } = useNewFormBase(taken);

  const create = useCallback((): void => {
    const { host, activeId } = useDocumentStore.getState();
    if (activeId !== null) settle(createSpriteInFile(host, activeId, form));
  }, [form, settle]);

  return { form, errors, summary, failure, valid: !hasErrors({ name: errors.name, size: errors.size }), update, create };
};

export { useNewSprite };
