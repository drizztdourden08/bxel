/* @layer renderer-app @kind logic */
import type { Committed } from './commit-draft.type';
import { commitSession } from './commit-session';
import { pathDraft } from './path-draft';
import { pathReady } from './path-ready';

const commitDraft = (): Committed | null => {
  const session = pathDraft.current;
  if (!session) return null;
  pathDraft.current = null;
  return pathReady(session) ? { session, result: commitSession(session) } : null;
};

export { commitDraft };
