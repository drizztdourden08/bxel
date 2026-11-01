/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';
import { paintScope } from '../sheet/paint-scope';
import { commitRequest } from './commit-request';
import type { EditorTarget, GradientSession } from './editor.type';
import { GRADIENT_LABEL } from './stroke.constants';

const gradientRequest = (target: EditorTarget, session: GradientSession): TransactionRequest => {
  const { spec } = session;
  const step = {
    name: 'pixels.gradient',
    options: {
      colors: spec.colors,
      line: spec.line,
      kind: spec.kind,
      reflect: spec.reflect,
      mode: spec.bayer === null ? 'bands' : 'dither',
      ...(spec.bayer === null ? {} : { dither: spec.bayer, pattern: spec.pattern, ...(spec.brushId === undefined ? {} : { brushId: spec.brushId }) }),
      wrap: spec.wrap,
      ...(session.mask ? { mask: session.mask } : {}),
    },
  };
  return commitRequest(target, GRADIENT_LABEL, step, paintScope(target));
};

export { gradientRequest };
