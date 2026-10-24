/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import { paintScope } from '../sheet/paint-scope';
import { commitRequest } from './commit-request';
import type { EditorTarget, ShapeSession } from './editor.type';
import { SHAPE_LABELS } from './tools.constants';

const shapeRequest = (target: EditorTarget, session: ShapeSession): TransactionRequest => {
  const { spec } = session;
  const { shape, from, to, index, filled, brush, symmetry } = spec;
  const step = {
    name: COMMAND_NAME.pixelsShape,
    options: { shape, from, to, index, filled, brush, symmetry, ...(session.mask ? { mask: session.mask } : {}) },
  };
  return commitRequest(target, SHAPE_LABELS[shape], step, paintScope(target));
};

export { shapeRequest };
