/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import { commitRequest } from './commit-request';
import type { EditorTarget, StrokeSession } from './editor.type';
import { STROKE_LABELS } from './stroke.constants';

const strokeRequest = (target: EditorTarget, session: StrokeSession): TransactionRequest => {
  const stroke = { points: session.points, brush: session.brush };
  const step =
    session.tool === 'pencil'
      ? { name: COMMAND_NAME.pixelsPaint, options: { ...stroke, index: session.index } }
      : { name: COMMAND_NAME.pixelsErase, options: stroke };
  return commitRequest(target, STROKE_LABELS[session.tool], step);
};

export { strokeRequest };
