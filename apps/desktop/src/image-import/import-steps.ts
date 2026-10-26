/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME, sheetImportSteps } from '@bxel/palette';
import type { SheetImportCell } from '@bxel/palette';
import { sourceColorText } from '../palette-source/source-color-text';
import { alphaThreshold } from './alpha-threshold';
import { cropRgba } from './crop-rgba';
import { frameOptions } from './frame-options';
import { BANK_REF } from './image-import.constants';
import type { BankOption, ImportRun } from './image-import.type';
import { sheetLayoutOf } from './sheet-layout-of';
import { sheetNameOf } from './sheet-name-of';
import { tiledSteps } from '../tiled-import/tiled-steps';

const bankStep = (run: ImportRun): CommandStep[] => {
  const draft = run.plan.bank;
  if (!draft || run.form.target === 'new') return [];
  const options = { name: draft.name, cap: draft.cap, transparent: draft.transparent, colors: draft.colors.map(sourceColorText) };
  return [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options, ref: BANK_REF }];
};

const cellOf = (run: ImportRun, at: number): SheetImportCell | null => {
  const rect = run.rects[at];
  const name = run.names[at];
  if (!rect || name === undefined) return null;
  const { form, image } = run;
  const picture = { width: rect.width, height: rect.height, rgba: Uint8Array.from(cropRgba(image, rect)) };
  const mapping = { dither: form.dither, originX: rect.x, originY: rect.y, alphaThreshold: alphaThreshold(form.alphaPercent) };
  return { name, image: picture, source: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, mapping };
};

const bankOption = (run: ImportRun, bankId: string | null): BankOption => {
  const id = bankId ?? run.plan.bankId;
  return id === null ? { ref: BANK_REF } : { bankId: id };
};

const importSteps = (run: ImportRun, bankId: string | null): CommandStep[] => {
  const bank = bankOption(run, bankId);
  if (run.form.kind === 'tiled') return [...bankStep(run), ...tiledSteps(run, bank)];
  const cells = run.rects.flatMap((_, at) => cellOf(run, at) ?? []);
  if (run.form.kind === 'sheet') {
    const layout = sheetLayoutOf(run);
    return [...bankStep(run), ...sheetImportSteps({ sheetName: sheetNameOf(run), ...layout, bank, cells })];
  }
  const sprites = cells.map((cell): CommandStep => ({
    name: PALETTE_COMMAND_NAME.spriteImport,
    targets: null,
    options: { name: cell.name, image: cell.image, bank, mapping: cell.mapping, ...frameOptions(run.image) },
  }));
  return [...bankStep(run), ...sprites];
};

export { importSteps };
