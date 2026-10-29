/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';
import { paintScope } from '../sheet/paint-scope';
import { commitRequest } from './commit-request';
import type { EditorTarget, SpraySession } from './editor.type';
import { SPRAY_LABEL } from './stroke.constants';

const sprayRequest = (target: EditorTarget, session: SpraySession): TransactionRequest => {
  const { options } = session;
  const step = {
    name: 'pixels.plot',
    options: {
      points: session.dots,
      index: session.index,
      brush: { shape: 'square', size: 1 },
      symmetry: options.symmetry,
      wrap: options.wrap,
      ...(options.ink ? { ink: options.ink } : {}),
      ...(session.mask ? { mask: session.mask } : {}),
    },
  };
  return commitRequest(target, SPRAY_LABEL, step, paintScope(target));
};

export { sprayRequest };
