/* @layer renderer-app @kind logic */
import { useSpriteStore } from '../../stores/useSpriteStore';
import type { EditorTarget } from '../editor.type';
import { PENDING_TEXT } from './pending.constants';
import type { PendingEdit, PendingScopeText } from './pending.type';
import { wholeSprite } from './whole-sprite';

const layersText = (target: EditorTarget, pending: PendingEdit): string => {
  if (!wholeSprite(pending)) return PENDING_TEXT.activeLayer(target.layer.name);
  const scope = pending.sprites.length > 1 ? useSpriteStore.getState().layerScope : 'all';
  if (scope === 'active') return PENDING_TEXT.activeLayer(target.layer.name);
  return scope === 'visible' ? PENDING_TEXT.visibleLayers : PENDING_TEXT.allLayers;
};

const scopeText = (target: EditorTarget, pending: PendingEdit): PendingScopeText => ({
  targets: PENDING_TEXT.targets(pending.sprites.length),
  layers: layersText(target, pending),
});

export { scopeText };
