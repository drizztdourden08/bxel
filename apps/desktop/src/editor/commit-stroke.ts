/* @layer renderer-app @kind logic */
import type { TransactionResult } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { currentTarget } from './current-target';
import type { StrokeSession } from './editor.type';
import { strokeRequest } from './stroke-request';

const commitStroke = (session: StrokeSession): TransactionResult | null => {
  const target = currentTarget();
  if (!target) return null;
  return useDocumentStore.getState().host.execute(strokeRequest(target, session));
};

export { commitStroke };
