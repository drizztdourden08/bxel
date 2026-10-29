/* @layer renderer-app @kind logic */
import type { TurnDirection } from '@bxel/document';
import { beginPending } from '../pending/begin-pending';
import { turnInSession } from './turn-in-session';

const startTurn = (direction: TurnDirection): boolean => turnInSession(direction) || beginPending({ kind: 'turn', direction });

export { startTurn };
