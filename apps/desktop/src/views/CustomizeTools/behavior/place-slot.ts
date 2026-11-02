/* @layer renderer-app @kind logic */
import { drawSurface } from '../../../editor/tool-catalogue/draw-surface';
import { moveSlot } from '../../../editor/tool-catalogue/move-slot';
import type { SlotMove } from '../../../editor/tool-catalogue/slot-layout.type';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';

const placeSlot = (surface: Surface, move: SlotMove): void => {
  useToolPrefsStore.getState().placeSlots(drawSurface(surface), moveSlot(slotsOf(surface), move));
};

export { placeSlot };
