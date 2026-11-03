/* @layer renderer-app @kind logic */
import { currentSurface } from '../../editor/tool-catalogue/current-surface';
import { drawSurface } from '../../editor/tool-catalogue/draw-surface';
import { placeMember } from '../../editor/tool-catalogue/place-member';
import { slotsOf } from '../../editor/tool-catalogue/slots-of';
import type { LayoutOp } from './layout-op.type';

const moveToolMember = (op: Extract<LayoutOp, { op: 'moveTool' }>): void => {
  const surface = op.surface ?? currentSurface();
  const slots = slotsOf(surface);
  if (!slots.some((slot) => slot.members.some((member) => member.id === op.member))) throw new Error(`Tool member "${op.member}" is not on the ${drawSurface(surface)} rail.`);
  if (op.slot !== undefined && !slots.some((slot) => slot.id === op.slot)) throw new Error(`Unknown slot "${op.slot}". Known slots: ${slots.map((slot) => slot.id).join(', ')}.`);
  placeMember(surface, { member: op.member, to: op.slot ?? null });
};

export { moveToolMember };
