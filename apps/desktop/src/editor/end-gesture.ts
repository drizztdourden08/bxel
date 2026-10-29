/* @layer renderer-app @kind logic */
import type { TransactionResult } from '@bxel/document';
import { commitSession } from './commit-session';
import type { PaintSession } from './editor.type';

const flat = (session: PaintSession): boolean => {
  if (session.kind !== 'gradient') return false;
  const { from, to } = session.spec.line;
  return from.x === to.x && from.y === to.y;
};

const endGesture = (session: PaintSession): TransactionResult | null => (flat(session) ? null : commitSession(session));

export { endGesture };
