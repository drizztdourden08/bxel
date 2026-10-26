/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { createAsset } from '../../../new-sprite/create-asset';
import { createNewFile } from '../../../new-sprite/create-new-file';
import { hasErrors } from '../../../new-sprite/has-errors';
import { KIND_NAMES_OF, NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreationKind, FormNames } from '../../../new-sprite/new-sprite.type';
import { openCreatedAsset } from '../../../new-sprite/open-created-asset';
import { placeCreatedAsset } from '../../../new-sprite/place-created-asset';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { focusDocument } from '../../../transactions/focus-document';
import { NO_NAMES, WORKSPACE_KINDS } from '../CreateDialog.constants';
import type { CreateFormState } from '../CreateDialog.type';
import { useNewFormBase } from './useNewFormBase';

const report = (error: string | null): void => {
  if (error !== null) toast(NEW_TEXT.failed(error), { variant: 'danger' });
};

const useNewFile = (): CreateFormState => {
  const view = useActiveDocument();
  const artwork = view?.state.artwork;
  const documentId = view?.state.documentId ?? null;
  const inProject = useWorkspaceStore((state) => (documentId === null ? false : state.workspaces[documentId]?.kind === 'project'));
  const targetFor = useCallback((kind: CreationKind): boolean => documentId !== null && (inProject || WORKSPACE_KINDS.includes(kind)), [documentId, inProject]);
  const names = useMemo<FormNames>(
    () => ({ namesFor: (kind) => (artwork && targetFor(kind) ? KIND_NAMES_OF[kind](artwork) : NO_NAMES), firstTileset: artwork?.tilesets[0]?.id ?? '' }),
    [artwork, targetFor],
  );
  const { form, errors, summary, failure, update, settle } = useNewFormBase(names);

  const create = useCallback((): void => {
    const { host } = useDocumentStore.getState();
    if (documentId !== null && targetFor(form.kind)) {
      const made = createAsset(host, documentId, form);
      const { dir } = useCreateDialogStore.getState();
      if (!settle(made) || !made.ok || !made.key) return;
      if (dir !== null) placeCreatedAsset(host, documentId, made.key, dir);
      void openCreatedAsset(documentId, made.key).then(report);
      return;
    }
    const outcome = createNewFile(host, form);
    if (settle(outcome) && outcome.ok) focusDocument(outcome.documentId);
  }, [documentId, targetFor, form, settle]);

  const inDocument = documentId !== null && targetFor(form.kind);
  const needsFile = WORKSPACE_KINDS.includes(form.kind) && documentId === null;
  return { form, errors, summary, failure, valid: !hasErrors(errors) && !needsFile, update, create, inDocument };
};

export { useNewFile };
