/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { goToCel } from './go-to-cel';

const jumpFrame = (end: 'first' | 'last'): void => {
  const target = currentTarget();
  const frame = end === 'first' ? target?.sprite.frames.at(0) : target?.sprite.frames.at(-1);
  if (target && frame) goToCel({ layerId: target.layerId, frameId: frame.id });
};

export { jumpFrame };
