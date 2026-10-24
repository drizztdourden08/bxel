/* @layer renderer-app @kind logic */
import { limitError } from '../palette-limit/limit-error';
import { SOURCE_TEXT } from '../palette-source/palette-source.constants';
import { nameError } from '../sprite-name/name-error';
import { sizeError } from '../sprite-name/size-error';
import { backgroundChoices } from './background-choices';
import { MAX_NEW_BANKS, MAX_SHEET_SPRITES, NEW_TEXT } from './new-sprite.constants';
import type { CreationForm, CreationErrors } from './new-sprite.type';
import { sheetCount } from './sheet-count';
import { spriteNames } from './sprite-names';
import { spriteSize } from './sprite-size';

const firstNameError = (form: CreationForm, taken: readonly string[]): string | null => {
  const failures = spriteNames(form).map((name) => nameError(name, taken));
  return failures.find((message) => message !== null) ?? null;
};

const layoutError = (form: CreationForm): string | null => {
  if (form.kind !== 'sheet') return null;
  const count = sheetCount(form);
  return Number.isInteger(count) && count >= 1 && count <= MAX_SHEET_SPRITES ? null : NEW_TEXT.sheetLimit;
};

const backgroundError = (form: CreationForm): string | null => {
  if (form.background === 'transparent') return null;
  return backgroundChoices(form).some((choice) => choice.slot === form.backgroundSlot) ? null : NEW_TEXT.backgroundPick;
};

const newFormErrors = (form: CreationForm, taken: readonly string[]): CreationErrors => {
  const { width, height } = spriteSize(form);
  return {
    name: firstNameError(form, taken),
    size: sizeError(width, height),
    sheet: layoutError(form),
    limit: limitError(form.limit),
    palette: form.source.kind === 'file' && form.source.file === null ? SOURCE_TEXT.choose : null,
    background: backgroundError(form),
    banks: Number.isInteger(form.banks) && form.banks >= 1 && form.banks <= MAX_NEW_BANKS ? null : NEW_TEXT.banksRange,
  };
};

export { newFormErrors };
