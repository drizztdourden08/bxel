/* @layer core @kind logic */
import type { PaletteBank, RampId } from '@bxel/document';
import { rampSlots } from './ramp-slots';
import { rampsOfSlot } from './ramps-of-slot';

const stepInRamp = (bank: PaletteBank, index: number, delta: number, rampId?: RampId): number | null => {
  const ramps = rampsOfSlot(bank, index);
  const ramp = (rampId === undefined ? undefined : ramps.find((each) => each.id === rampId)) ?? ramps[0];
  if (!ramp) return null;
  const slots = rampSlots(bank, ramp);
  const at = slots.indexOf(index);
  const next = Math.max(0, Math.min(slots.length - 1, at + Math.round(delta)));
  return slots[next] ?? null;
};

export { stepInRamp };
