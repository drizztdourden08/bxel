/* @layer renderer-app @kind logic */
import type { TurnDirection } from '@bxel/document';
import { beginPending } from '../pending/begin-pending';

const startTurn = (direction: TurnDirection): boolean => beginPending({ kind: 'turn', direction });

export { startTurn };
