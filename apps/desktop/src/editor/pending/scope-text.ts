/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor.type';
import { PENDING_TEXT } from './pending.constants';
import type { PendingEdit, PendingScopeText } from './pending.type';
import { wholeSprite } from './whole-sprite';

const scopeText = (target: EditorTarget, pending: PendingEdit): PendingScopeText => {
  const { sprite, layer, frameId } = target;
  const whole = wholeSprite(pending);
  const at = sprite.frames.findIndex((frame) => frame.id === frameId) + 1;
  return {
    targets: PENDING_TEXT.targets(1),
    layers: whole ? PENDING_TEXT.allLayers : PENDING_TEXT.activeLayer(layer.name),
    frames: whole ? PENDING_TEXT.allFrames(sprite.frames.length) : PENDING_TEXT.currentFrame(at, sprite.frames.length),
  };
};

export { scopeText };
