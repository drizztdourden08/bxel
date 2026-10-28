/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, PaletteBank } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { RampStep } from '@bxel/palette';
import { RAMP_REF } from './palette-ramps.constants';

const rampSteps = (bank: PaletteBank, steps: readonly RampStep[], name: string): CommandStep[] => {
  const adds = steps.flatMap((step, at): CommandStep[] =>
    step.reuses === null ? [{ name: COMMAND_NAME.swatchAdd, targets: null, options: { bankId: bank.id, rgb: step.hex }, ref: RAMP_REF(at) }] : [],
  );
  const swatches = steps.map((step, at) => {
    const reused = step.reuses === null ? undefined : bank.slots[step.reuses]?.id;
    return reused ?? { ref: RAMP_REF(at) };
  });
  return [...adds, { name: PALETTE_COMMAND_NAME.rampAdd, targets: null, options: { bankId: bank.id, name, swatches } }];
};

export { rampSteps };
