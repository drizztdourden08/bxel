/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';
import type { EditorTarget, PaintSession } from './editor.type';
import { shapeRequest } from './shape-request';
import { strokeRequest } from './stroke-request';

const sessionRequest = (target: EditorTarget, session: PaintSession): TransactionRequest =>
  session.kind === 'stroke' ? strokeRequest(target, session) : shapeRequest(target, session);

export { sessionRequest };
