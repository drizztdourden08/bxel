/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { goToCel } from './go-to-cel';

const addPick = (): void => {
  const target = currentTarget();
  if (target) goToCel({ layerId: target.layerId, frameId: target.frameId }, false, true);
};

export { addPick };
