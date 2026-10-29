/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';
import type { EditorTarget, PaintSession } from './editor.type';
import { gradientRequest } from './gradient-request';
import { pathRequest } from './path-request';
import { shapeRequest } from './shape-request';
import { sprayRequest } from './spray-request';
import { strokeRequest } from './stroke-request';

const sessionRequest = (target: EditorTarget, session: PaintSession): TransactionRequest => {
  switch (session.kind) {
    case 'stroke':
      return strokeRequest(target, session);
    case 'shape':
      return shapeRequest(target, session);
    case 'path':
      return pathRequest(target, session);
    case 'gradient':
      return gradientRequest(target, session);
    case 'spray':
      return sprayRequest(target, session);
  }
};

export { sessionRequest };
