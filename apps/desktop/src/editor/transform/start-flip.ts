/* @layer renderer-app @kind logic */
import type { FlipAxis } from '@bxel/document';
import { beginPending } from '../pending/begin-pending';

const startFlip = (axis: FlipAxis): boolean => beginPending({ kind: 'flip', axis });

export { startFlip };
