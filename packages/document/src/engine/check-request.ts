/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import { parseOptions } from '../commands/parse-options';
import type { TransactionRequest } from '../commands/transaction.type';
import { MAX_STEPS } from '../model/limits.constants';
import { transactionRequestSchema } from '../schema/transaction-schema';
import type { EngineStore } from './engine.type';
import { guardDocument } from './guard-document';

const checkRequest = (store: EngineStore, request: TransactionRequest): void => {
  parseOptions(transactionRequestSchema, request, 'request');
  guardDocument(store, request.documentId, request.baseRevision);
  if (request.steps.length > MAX_STEPS) {
    throw fail(ERROR_CODE.BATCH_TOO_LARGE, `A transaction has at most ${MAX_STEPS} steps.`);
  }
};

export { checkRequest };
