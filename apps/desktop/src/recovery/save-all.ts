/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { QuitDeps } from './recovery.type';

const saveAll = async (deps: QuitDeps, documentIds: readonly DocumentId[]): Promise<boolean> => {
  for (const documentId of documentIds) {
    if (!(await deps.save(documentId))) return false;
  }
  return true;
};

export { saveAll };
