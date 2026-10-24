/* @layer renderer-app @kind logic */
import { numberedNames } from '../sprite-name/numbered-names';
import { MAX_SHEET_SPRITES } from './new-sprite.constants';
import type { CreationForm } from './new-sprite.type';
import { sheetCount } from './sheet-count';

const spriteNames = (form: CreationForm): string[] => {
  const base = form.name.trim();
  if (form.kind !== 'sheet') return [base];
  const count = sheetCount(form);
  return numberedNames(base, Number.isInteger(count) ? Math.min(Math.max(0, count), MAX_SHEET_SPRITES + 1) : 0);
};

export { spriteNames };
