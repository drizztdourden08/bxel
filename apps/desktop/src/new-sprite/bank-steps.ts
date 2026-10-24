/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { bankPlan } from '../palette-source/bank-plan';
import { BANK_NAME_ROOM } from './new-sprite.constants';
import type { CreationForm } from './new-sprite.type';

const bankSteps = (form: CreationForm): CommandStep[] => {
  const { bank } = bankPlan(form.source, form.limit, form.transparent);
  const colors = bank.colors.map((color) => color.rgb);
  return Array.from({ length: Math.max(form.banks - 1, 0) }, (_unused, at) => ({
    name: PALETTE_COMMAND_NAME.paletteCreate,
    targets: null,
    options: { name: `${bank.name.slice(0, BANK_NAME_ROOM)} ${at + 2}`, cap: bank.cap, transparent: bank.transparent, colors },
  }));
};

export { bankSteps };
