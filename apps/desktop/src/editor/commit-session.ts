/* @layer renderer-app @kind logic */
import type { TransactionResult } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import type { PaintSession } from './editor.type';
import { sessionRequest } from './session-request';

const commitSession = (session: PaintSession): TransactionResult | null => {
  const target = currentTarget();
  if (!target) return null;
  const result = useDocumentStore.getState().host.execute(sessionRequest(target, session));
  const last = session.kind === 'stroke' ? session.points.at(-1) : undefined;
  if (result.ok && last) useToolStore.getState().setLastPoint(last);
  return result;
};

export { commitSession };
