/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { clampIndex } from './clamp-index';
import { goToFrame } from './go-to-frame';

const stepFrame = (delta: number, extend: boolean): void => {
  const target = currentTarget();
  if (!target) return;
  const { frames } = target.sprite;
  const next = frames[clampIndex(frames.findIndex((frame) => frame.id === target.frameId) + delta, frames.length)];
  if (next) goToFrame(next.id, extend);
};

export { stepFrame };
