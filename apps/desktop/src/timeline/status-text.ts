/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import { fpsOf } from './fps-of';
import { playSequence } from './play-sequence';
import { TIMELINE_TEXT } from './timeline.constants';
import type { PlayOptions } from './timeline.type';

const statusText = (target: EditorTarget, options: PlayOptions): string => {
  const { sprite, frameId } = target;
  const at = sprite.frames.findIndex((frame) => frame.id === frameId);
  const duration = sprite.frames[at]?.durationMs ?? 0;
  const fps = fpsOf(sprite, playSequence(sprite, frameId, options));
  return TIMELINE_TEXT.status(at + 1, sprite.frames.length, duration, TIMELINE_TEXT.fps(fps));
};

export { statusText };
