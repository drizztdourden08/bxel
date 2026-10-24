/* @layer renderer-app @kind logic */
import { limitError } from '../palette-limit/limit-error';
import { SOURCE_TEXT } from '../palette-source/palette-source.constants';
import { nameError } from '../sprite-name/name-error';
import { sizeError } from '../sprite-name/size-error';
import { backgroundChoices } from './background-choices';
import { MAX_MAP_SIDE, MAX_NEW_BANKS, MAX_SHEET_SPRITES, NEW_TEXT, NO_ERRORS } from './new-sprite.constants';
import type { CreationErrors, CreationForm } from './new-sprite.type';
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

const mapError = (form: CreationForm): string | null => {
  const fits = (side: number): boolean => Number.isInteger(side) && side >= 1 && side <= MAX_MAP_SIDE;
  if (form.tilesetId === '') return NEW_TEXT.noTileset;
  return fits(form.columns) && fits(form.rows) ? null : NEW_TEXT.mapSize(MAX_MAP_SIDE);
};

const otherErrors = (form: CreationForm, taken: readonly string[]): CreationErrors | null => {
  const name = firstNameError(form, taken);
  if (form.kind === 'palette') {
    return { ...NO_ERRORS, name, limit: limitError(form.limit), palette: form.source.kind === 'file' && form.source.file === null ? SOURCE_TEXT.choose : null };
  }
  if (form.kind === 'tileset') return { ...NO_ERRORS, name, size: sizeError(form.width, form.height) };
  return form.kind === 'tilemap' ? { ...NO_ERRORS, name, sheet: mapError(form) } : null;
};

const newFormErrors = (form: CreationForm, taken: readonly string[]): CreationErrors => {
  const other = otherErrors(form, taken);
  if (other !== null) return other;
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
