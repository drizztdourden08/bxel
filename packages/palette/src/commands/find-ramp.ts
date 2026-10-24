/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank, Ramp } from '@bxel/document';

const findRamp = (bank: PaletteBank, rampId: string): Ramp => {
  const ramp = bank.ramps.find((candidate) => candidate.id === rampId);
  if (!ramp) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Ramp ${rampId} is not in bank ${bank.id}.`, { path: 'options.rampId' });
  return ramp;
};

export { findRamp };
