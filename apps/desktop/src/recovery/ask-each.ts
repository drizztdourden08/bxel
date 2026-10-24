/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { CloseChoices, DirtyDocument, QuitDeps } from './recovery.type';

const askEach = async (deps: QuitDeps, documents: readonly DirtyDocument[]): Promise<CloseChoices | null> => {
  const save: DocumentId[] = [];
  const discard: DocumentId[] = [];
  for (const { documentId, name } of documents) {
    const answer = await deps.ask(name);
    if (answer === 'cancel') return null;
    (answer === 'save' ? save : discard).push(documentId);
  }
  return { save, discard };
};

export { askEach };
