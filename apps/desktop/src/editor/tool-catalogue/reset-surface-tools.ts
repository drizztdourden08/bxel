/* @layer renderer-app @kind logic */
import { drawSurface } from './draw-surface';
import { slotsOf } from './slots-of';
import type { Surface } from './surface.type';
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';

const resetSurfaceTools = (surface: Surface): void => {
  const ids = slotsOf(surface).flatMap((slot) => slot.members.map((member) => member.id));
  useToolPrefsStore.getState().resetSurface(drawSurface(surface), ids);
};

export { resetSurfaceTools };
