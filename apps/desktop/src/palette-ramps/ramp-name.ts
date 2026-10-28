/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { RAMP_TEXT } from './palette-ramps.constants';

const rampName = (bank: PaletteBank): string => {
  const taken = new Set(bank.ramps.map((ramp) => ramp.name.toLowerCase()));
  let number = bank.ramps.length + 1;
  while (taken.has(RAMP_TEXT.defaultName(number).toLowerCase())) number += 1;
  return RAMP_TEXT.defaultName(number);
};

export { rampName };
