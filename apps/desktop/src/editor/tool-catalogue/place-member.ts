/* @layer renderer-app @kind logic */
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';
import { drawSurface } from './draw-surface';
import { moveMember } from './move-member';
import type { MemberMove } from './slot-layout.type';
import { slotsOf } from './slots-of';
import type { Surface } from './surface.type';

const placeMember = (surface: Surface, move: MemberMove): void => {
  useToolPrefsStore.getState().placeSlots(drawSurface(surface), moveMember(slotsOf(surface), move));
};

export { placeMember };
