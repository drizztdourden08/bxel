/* @layer renderer-app @kind logic */
import { drawSurface } from '../../../editor/tool-catalogue/draw-surface';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';

const resetSurfaceTools = (surface: Surface): void => {
  const ids = slotsOf(surface).flatMap((slot) => slot.members.map((member) => member.id));
  useToolPrefsStore.getState().resetSurface(drawSurface(surface), ids);
};

export { resetSurfaceTools };
