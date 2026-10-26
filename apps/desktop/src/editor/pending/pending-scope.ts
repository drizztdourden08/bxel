/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { groupScope } from '../../sheet/group-scope';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { cellScope } from '../cell-scope';
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';
import { wholeSprite } from './whole-sprite';

const pendingScope = (target: EditorTarget, pending: PendingEdit): TargetScope => {
  if (!wholeSprite(pending)) return cellScope(target);
  if (pending.sprites.length < 2) return { sprites: [target.sprite.id], layers: { by: 'all' }, frames: { by: 'all' } };
  const { layerScope } = useSpriteStore.getState();
  return groupScope(target, pending.sprites, layerScope);
};

export { pendingScope };
