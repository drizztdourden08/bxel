/* @layer renderer-app @kind logic */
import { beginPending } from '../pending/begin-pending';

const startMove = (): boolean => beginPending({ kind: 'move', offset: { x: 0, y: 0 } });

export { startMove };
