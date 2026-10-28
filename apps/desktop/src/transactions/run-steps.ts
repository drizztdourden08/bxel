/* @layer renderer-app @kind logic */
import type { CommandStep, DocumentId, TransactionResult } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { stepRequest } from './step-request';

const runSteps = (host: DocumentHost, documentId: DocumentId, label: string, steps: readonly CommandStep[]): TransactionResult =>
  host.execute(stepRequest(host, documentId, label, steps));

export { runSteps };
