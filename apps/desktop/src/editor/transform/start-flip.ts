/* @layer renderer-app @kind logic */
import type { FlipAxis } from '@bxel/document';
import { beginPending } from '../pending/begin-pending';
import { flipInSession } from './flip-in-session';

const startFlip = (axis: FlipAxis): boolean => flipInSession(axis) || beginPending({ kind: 'flip', axis });

export { startFlip };
