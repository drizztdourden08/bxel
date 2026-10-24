/* @layer renderer-app @kind logic */
import { PALETTE_TEXT } from '../editor/palette-text.constants';
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { usageLine } from '../palette-limit/usage-line';
import { bankPlan } from '../palette-source/bank-plan';
import { sourceColors } from '../palette-source/source-colors';
import { SOURCE_TEXT } from '../palette-source/palette-source.constants';
import { formReport } from './form-report';
import { NEW_TEXT } from './new-sprite.constants';
import type { CreationForm, CreationSummary } from './new-sprite.type';
import { sheetCount } from './sheet-count';
import { spriteNames } from './sprite-names';

const sheetNote = (form: CreationForm): string | null => {
  if (form.kind !== 'sheet') return null;
  const names = spriteNames(form);
  return NEW_TEXT.sheetNote(sheetCount(form), names[0] ?? '', names[names.length - 1] ?? '');
};

const newSummary = (form: CreationForm): CreationSummary => {
  const plan = bankPlan(form.source, form.limit, form.transparent);
  const total = sourceColors(form.source).length;
  return {
    count: PALETTE_TEXT.count(form.limit, form.transparent),
    usage: usageLine(0, opaqueSlots(form.limit, form.transparent)),
    fits: plan.dropped > 0 ? SOURCE_TEXT.fits(total - plan.dropped, total) : null,
    sheet: sheetNote(form),
    platform: formReport(form),
    banks: form.banks > 1 ? NEW_TEXT.banksNote(form.banks, form.limit) : null,
  };
};

export { newSummary };
