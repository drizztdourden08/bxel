/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import { commitRequest } from './commit-request';
import type { EditorTarget, ShapeSession } from './editor.type';
import { SHAPE_LABELS } from './tools.constants';

const shapeRequest = (target: EditorTarget, session: ShapeSession): TransactionRequest => {
  const { spec } = session;
  const { shape, from, to, index, filled, brush, symmetry } = spec;
  return commitRequest(target, SHAPE_LABELS[shape], {
    name: COMMAND_NAME.pixelsShape,
    options: { shape, from, to, index, filled, brush, symmetry },
  });
};

export { shapeRequest };
