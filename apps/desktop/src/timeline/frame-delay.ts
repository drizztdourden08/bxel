/* @layer renderer-app @kind logic */
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import { currentTarget } from '../editor/current-target';

const frameDelay = (): number => {
  const target = currentTarget();
  return target?.sprite.frames.find((frame) => frame.id === target.frameId)?.durationMs ?? DEFAULT_FRAME_DURATION_MS;
};

export { frameDelay };
