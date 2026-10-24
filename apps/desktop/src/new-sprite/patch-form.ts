/* @layer renderer-app @kind logic */
import { backgroundChoices } from './background-choices';
import type { CreationForm } from './new-sprite.type';

const settled = (form: CreationForm): CreationForm => {
  if (form.background === 'transparent') return form;
  const choices = backgroundChoices(form);
  if (choices.some((choice) => choice.slot === form.backgroundSlot)) return form;
  return { ...form, backgroundSlot: choices[0]?.slot ?? form.backgroundSlot };
};

const patchForm = (form: CreationForm, patch: Partial<CreationForm>): CreationForm => {
  const next = { ...form, ...patch };
  const flipped = patch.transparent !== undefined && patch.transparent !== form.transparent;
  if (!flipped) return settled(next);
  return settled({ ...next, background: next.transparent ? 'transparent' : 'opaque', backgroundSlot: 0 });
};

export { patchForm };
