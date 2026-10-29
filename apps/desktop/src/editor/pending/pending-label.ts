/* @layer renderer-app @kind logic */
import { FLIP_LABELS, PENDING_TEXT, TURN_LABELS } from './pending.constants';
import type { PendingSpec } from './pending.type';
import { transformLabel } from '../transform/transform-label';

const pendingLabel = (spec: PendingSpec): string => {
  switch (spec.kind) {
    case 'flip':
      return FLIP_LABELS[spec.axis];
    case 'turn':
      return TURN_LABELS[spec.direction];
    case 'transform':
      return transformLabel(spec);
    case 'move':
      return PENDING_TEXT.move;
    case 'paste':
      return PENDING_TEXT.paste;
  }
};

export { pendingLabel };
