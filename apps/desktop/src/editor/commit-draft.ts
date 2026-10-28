/* @layer renderer-app @kind logic */
import type { TransactionResult } from '@bxel/document';
import { commitSession } from './commit-session';
import { pathDraft } from './path-draft';
import { pathReady } from './path-session';
import type { PathSession } from './editor.type';

type Committed = { readonly session: PathSession; readonly result: TransactionResult | null };

const commitDraft = (): Committed | null => {
  const session = pathDraft.current;
  if (!session) return null;
  pathDraft.current = null;
  return pathReady(session) ? { session, result: commitSession(session) } : null;
};

const cancelDraft = (): void => {
  pathDraft.current = null;
};

export { cancelDraft, commitDraft };
