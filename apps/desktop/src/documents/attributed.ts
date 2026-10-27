/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';
import { acting } from './acting-as.constants';

const attributed = (request: TransactionRequest): TransactionRequest => {
  const who = acting.current;
  if (who === null || request.mode === 'preview') return request;
  return { ...request, origin: 'mcp', actor: who.actor, label: who.label(request.label) };
};

export { attributed };
