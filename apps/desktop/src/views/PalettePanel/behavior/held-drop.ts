/* @layer renderer-app @kind logic */
import { setHeldColour } from '../../../editor/set-held-colour';

const heldDrop = (point: { clientX: number; clientY: number }, index: number): boolean => {
  const chip = document.elementsFromPoint(point.clientX, point.clientY).find((element): element is HTMLElement => element instanceof HTMLElement && element.dataset.heldSlot !== undefined);
  const position = chip ? Number(chip.dataset.heldSlot) : Number.NaN;
  if (Number.isNaN(position)) return false;
  setHeldColour(position, index);
  return true;
};

export { heldDrop };
