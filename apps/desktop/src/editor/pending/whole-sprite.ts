/* @layer renderer-app @kind logic */
import type { PendingEdit } from './pending.type';

const wholeSprite = (pending: PendingEdit): boolean =>
  pending.mask === null && (pending.spec.kind === 'flip' || pending.spec.kind === 'turn');

export { wholeSprite };
