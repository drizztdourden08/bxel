/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { DocumentId, TransactionResult } from '@bxel/document';

const missingDocument = (documentId: DocumentId, baseRevision: number): TransactionResult => ({
  ok: false,
  baseRevision,
  revision: 0,
  error: {
    code: ERROR_CODE.DOCUMENT_NOT_FOUND,
    message: `Document ${documentId} is not open here.`,
    step: null,
    path: null,
    details: [],
  },
});

export { missingDocument };
