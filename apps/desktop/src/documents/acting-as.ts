/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';

type ActingAs = { readonly actor: string; readonly label: (label: string) => string };

const acting: { current: ActingAs | null } = { current: null };

const actAs = async <T>(who: ActingAs, run: () => T | Promise<T>): Promise<T> => {
  const before = acting.current;
  acting.current = who;
  try {
    return await run();
  } finally {
    acting.current = before;
  }
};

const attributed = (request: TransactionRequest): TransactionRequest => {
  const who = acting.current;
  if (who === null || request.mode === 'preview') return request;
  return { ...request, origin: 'mcp', actor: who.actor, label: who.label(request.label) };
};

export { actAs, attributed };
