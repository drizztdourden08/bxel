/* @layer renderer-app @kind logic */
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { stepSlot } from '../../../editor/tool-catalogue/step-slot';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import { placeSlot } from './place-slot';

const stepPlacedSlot = (surface: Surface, id: string, step: 1 | -1): void => {
  const move = stepSlot(slotsOf(surface), id, step);
  if (move !== null) placeSlot(surface, move);
};

export { stepPlacedSlot };
