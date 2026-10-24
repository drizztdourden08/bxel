/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { alphaThreshold } from './alpha-threshold';
import { cropRgba } from './crop-rgba';
import { BANK_REF } from './image-import.constants';
import type { ImportRun } from './image-import.type';

const bankStep = (run: ImportRun): CommandStep[] => {
  const draft = run.plan.bank;
  if (!draft || run.form.target === 'new') return [];
  const options = { name: draft.name, cap: draft.cap, transparent: draft.transparent, colors: draft.colors.map((color) => color.rgb) };
  return [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options, ref: BANK_REF }];
};

const spriteStep = (run: ImportRun, bankId: string | null, at: number): CommandStep | null => {
  const rect = run.rects[at];
  const name = run.names[at];
  if (!rect || name === undefined) return null;
  const { form, image } = run;
  const picture = { width: rect.width, height: rect.height, rgba: cropRgba(image, rect) };
  const bank = bankId === null ? { ref: BANK_REF } : { bankId };
  const mapping = { dither: form.dither, originX: rect.x, originY: rect.y, alphaThreshold: alphaThreshold(form.alphaPercent) };
  return { name: PALETTE_COMMAND_NAME.spriteImport, targets: null, options: { name, image: picture, bank, mapping } };
};

const importSteps = (run: ImportRun, bankId: string | null): CommandStep[] => {
  const sprites = run.rects.map((_, at) => spriteStep(run, bankId ?? run.plan.bankId, at));
  return [...bankStep(run), ...sprites.filter((step): step is CommandStep => step !== null)];
};

export { importSteps };
