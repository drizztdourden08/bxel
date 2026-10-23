/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { DocumentId } from '../model/ids.type';
import type { EngineStore } from './engine.type';

const guardDocument = (store: EngineStore, documentId: DocumentId, revision: number): void => {
  if (documentId !== store.documentId) {
    throw fail(ERROR_CODE.DOCUMENT_NOT_FOUND, `Document ${documentId} is not open here.`);
  }
  if (store.readOnly) throw fail(ERROR_CODE.READ_ONLY_DOCUMENT, 'This document is read-only.');
  if (revision !== store.revision) {
    throw fail(ERROR_CODE.STALE_REVISION, `The request expects revision ${revision}, the document is at ${store.revision}.`);
  }
};

export { guardDocument };
