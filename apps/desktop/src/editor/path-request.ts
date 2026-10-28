/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import { paintScope } from '../sheet/paint-scope';
import { commitRequest } from './commit-request';
import type { EditorTarget, PathSession } from './editor.type';
import { PATH_LABELS } from './tools.constants';

const shapeOptions = (session: PathSession) => {
  const [first, second] = session.vertices;
  const hover = session.hover;
  if (session.tool === 'curve') {
    return { shape: 'curve', from: first ?? hover, control: hover, to: second ?? hover, pixelPerfect: session.spec.pixelPerfect };
  }
  return {
    shape: session.tool,
    points: session.vertices,
    ...(session.tool === 'contour' ? { pixelPerfect: session.spec.pixelPerfect } : {}),
  };
};

const pathRequest = (target: EditorTarget, session: PathSession): TransactionRequest => {
  const { spec } = session;
  const step = {
    name: COMMAND_NAME.pixelsShape,
    options: {
      ...shapeOptions(session),
      index: spec.index,
      filled: spec.filled,
      brush: spec.brush,
      symmetry: spec.symmetry,
      wrap: spec.wrap,
      ...(spec.fillIndex === undefined ? {} : { fillIndex: spec.fillIndex }),
      ...(spec.ink ? { ink: spec.ink } : {}),
      ...(session.mask ? { mask: session.mask } : {}),
    },
  };
  return commitRequest(target, PATH_LABELS[session.tool], step, paintScope(target));
};

export { pathRequest };
