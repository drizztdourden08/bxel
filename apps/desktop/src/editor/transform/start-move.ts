/* @layer renderer-app @kind logic */
import { beginPending } from '../pending/begin-pending';

const startMove = (copy = false): boolean => beginPending({ kind: 'move', offset: { x: 0, y: 0 }, ...(copy ? { copy } : {}) });

export { startMove };
