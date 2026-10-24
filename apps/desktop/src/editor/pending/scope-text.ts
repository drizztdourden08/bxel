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

const framesText = (target: EditorTarget, pending: PendingEdit): string => {
  const { sprite, frameId } = target;
  const at = sprite.frames.findIndex((frame) => frame.id === frameId) + 1;
  const scope = wholeSprite(pending) && (pending.sprites.length < 2 || useSpriteStore.getState().frameScope === 'all') ? 'all' : 'current';
  return scope === 'all' ? PENDING_TEXT.allFrames(sprite.frames.length) : PENDING_TEXT.currentFrame(at, sprite.frames.length);
};

const scopeText = (target: EditorTarget, pending: PendingEdit): PendingScopeText => ({
  targets: PENDING_TEXT.targets(pending.sprites.length),
  layers: layersText(target, pending),
  frames: framesText(target, pending),
});

export { scopeText };
