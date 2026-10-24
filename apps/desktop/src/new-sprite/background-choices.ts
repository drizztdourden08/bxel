/* @layer renderer-app @kind logic */
import { bankPlan } from '../palette-source/bank-plan';
import type { BackgroundChoice, CreationForm } from './new-sprite.type';

const backgroundChoices = (form: CreationForm): BackgroundChoice[] => {
  const first = form.transparent ? 1 : 0;
  return bankPlan(form.source, form.limit, form.transparent).bank.colors.map((color, at) => ({
    slot: first + at,
    name: color.name,
    rgb: color.rgb,
  }));
};

export { backgroundChoices };
