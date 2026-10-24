/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { cellScope } from '../cell-scope';
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';
import { wholeSprite } from './whole-sprite';

const pendingScope = (target: EditorTarget, pending: PendingEdit): TargetScope =>
  wholeSprite(pending)
    ? { sprites: [target.sprite.id], layers: { by: 'all' }, frames: { by: 'all' } }
    : cellScope(target);

export { pendingScope };
