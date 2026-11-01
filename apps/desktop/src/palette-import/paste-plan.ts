/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { importPlan } from './import-plan';
import { IMPORT_TEXT } from './palette-import.constants';
import type { PastePlan } from './paste-plan.type';
import { sourceFromText } from './source-from-text';

const pastePlan = (bank: PaletteBank, text: string | null): PastePlan => {
  const source = text === null ? null : sourceFromText(text);
  if (source === null) return { ok: false, message: IMPORT_TEXT.noneOnClipboard };
  const plan = importPlan(bank, source.colors, 'append');
  return plan.steps.length === 0 ? { ok: false, message: IMPORT_TEXT.nothing } : { ok: true, plan };
};

export { pastePlan };
