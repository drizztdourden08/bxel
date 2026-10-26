/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { selectFrameIds } from './select-frame-ids';

const selectAllFrames = (): void => {
  const target = currentTarget();
  if (target) selectFrameIds(target.layerId, target.sprite.frames.map((frame) => frame.id), target.frameId);
};

export { selectAllFrames };
