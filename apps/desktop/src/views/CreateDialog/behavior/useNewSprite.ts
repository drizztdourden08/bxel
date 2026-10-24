/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { createSpriteInFile } from '../../../new-sprite/create-sprite-in-file';
import { hasErrors } from '../../../new-sprite/has-errors';
import type { FormNames } from '../../../new-sprite/new-sprite.type';
import { spriteCheck } from '../../../new-sprite/sprite-check';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { SpriteFormState } from '../CreateDialog.type';
import { useNewFormBase } from './useNewFormBase';

const useNewSprite = (): SpriteFormState => {
  const view = useActiveDocument();
  const names = useMemo<FormNames>(() => {
    const taken = view?.state.artwork.sprites.map((sprite) => sprite.name) ?? [];
    return { namesFor: () => taken, firstTileset: '' };
  }, [view]);
  const { form, errors, summary, failure, update, settle } = useNewFormBase(names);
  const check = useMemo(() => spriteCheck(view?.state.artwork, { width: form.width, height: form.height }), [view, form.width, form.height]);

  const create = useCallback((): void => {
    const { host, activeId } = useDocumentStore.getState();
    if (activeId !== null) settle(createSpriteInFile(host, activeId, form));
  }, [form, settle]);

  const valid = !hasErrors({ name: errors.name, size: errors.size, blocked: check.blocked });
  return { form, errors, summary, failure, valid, update, create, check };
};

export { useNewSprite };
