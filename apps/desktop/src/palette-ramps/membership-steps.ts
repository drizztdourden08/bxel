/* @layer renderer-app @kind logic */
import type { CommandStep, PaletteBank, Ramp } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { MembershipMove } from './palette-ramps.type';

const rampStep = (bank: PaletteBank, ramp: Ramp, swatches: readonly string[]): CommandStep =>
  swatches.length < 2
    ? { name: PALETTE_COMMAND_NAME.rampDelete, targets: null, options: { bankId: bank.id, rampId: ramp.id } }
    : { name: PALETTE_COMMAND_NAME.rampUpdate, targets: null, options: { bankId: bank.id, rampId: ramp.id, swatches } };

const membershipSteps = (bank: PaletteBank, move: MembershipMove): CommandStep[] => {
  const id = bank.slots[move.index]?.id;
  if (id === undefined || move.from === move.to) return [];
  const steps: CommandStep[] = [];
  const target = bank.ramps.find((ramp) => ramp.id === move.to);
  if (target && !target.swatches.includes(id)) steps.push(rampStep(bank, target, [...target.swatches, id]));
  const source = bank.ramps.find((ramp) => ramp.id === move.from);
  if (source && !move.copy) steps.push(rampStep(bank, source, source.swatches.filter((each) => each !== id)));
  return steps;
};

export { membershipSteps };
