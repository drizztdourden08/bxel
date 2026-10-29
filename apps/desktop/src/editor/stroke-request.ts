/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import { paintScope } from '../sheet/paint-scope';
import { commitRequest } from './commit-request';
import { customPoints } from './custom-points';
import type { EditorTarget, StrokeSession } from './editor.type';
import { STROKE_LABELS } from './stroke.constants';

const stampStep = (session: StrokeSession) => {
  const { custom, symmetry, wrap, ink } = session.options;
  if (!custom) return null;
  return {
    name: 'pixels.stamp',
    options: {
      ...(custom.brushId === null ? { patch: custom.patch } : { brushId: custom.brushId }),
      points: customPoints(session.points),
      skipZero: true,
      flipX: custom.flipX,
      flipY: custom.flipY,
      turn: custom.turn,
      symmetry,
      wrap,
      ...(ink ? { ink } : {}),
      ...(session.mask ? { mask: session.mask } : {}),
    },
  };
};

const strokeRequest = (target: EditorTarget, session: StrokeSession): TransactionRequest => {
  const { brush, pixelPerfect, symmetry, wrap, ink } = session.options;
  const stroke = { points: session.points, brush, pixelPerfect, symmetry, wrap, ...(ink ? { ink } : {}), ...(session.mask ? { mask: session.mask } : {}) };
  const painting = session.tool === 'pencil' || session.inverse;
  const plain = painting
    ? { name: COMMAND_NAME.pixelsPaint, options: { ...stroke, index: session.index } }
    : { name: COMMAND_NAME.pixelsErase, options: stroke };
  return commitRequest(target, STROKE_LABELS[session.tool], stampStep(session) ?? plain, paintScope(target));
};

export { strokeRequest };
