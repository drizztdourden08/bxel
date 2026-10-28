/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank, Sprite } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { paletteSlots } from '../editor/palette-slots';
import { gradientSteps } from '../palette-ramps/gradient-steps';
import { RAMP_TEXT } from '../palette-ramps/palette-ramps.constants';
import type { PaletteSheetRequest } from '../stores/palette-panel-store.type';
import { duplicateGroups } from './duplicate-groups';
import { PANEL_LABEL, PANEL_TEXT, SHEET_TEXT } from './palette-panel.constants';
import type { RemovalWords, SheetPlan } from './palette-panel.type';
import { paletteUsage } from './palette-usage';

const hexes = (bank: PaletteBank, indices: readonly number[]): string[] => {
  const slots = paletteSlots(bank);
  return indices.map((index) => slots[index]?.hex ?? '');
};

const removalPlan = (bank: PaletteBank, gone: readonly number[], words: RemovalWords): SheetPlan => {
  const kept = bank.slots.flatMap((_, index) => (gone.includes(index) ? [] : [index]));
  const steps = gone.length === 0 ? [] : [{ name: words.command, targets: null, options: { bankId: bank.id } }];
  const all = hexes(bank, bank.slots.map((_, at) => at));
  return { title: words.title, note: words.note(gone.length), gone: hexes(bank, gone), before: all, after: hexes(bank, kept), steps, label: words.label, done: words.done(gone.length), apply: words.apply(gone.length) };
};

const unusedPlan = (artwork: Artwork, bank: PaletteBank, sprite: Sprite): SheetPlan =>
  removalPlan(bank, paletteUsage(artwork, bank, sprite, 'palette').unused, {
    command: PALETTE_COMMAND_NAME.paletteRemoveUnused,
    title: SHEET_TEXT.unusedTitle,
    note: SHEET_TEXT.unusedNote,
    label: PANEL_LABEL.removeUnused,
    done: PANEL_TEXT.removed,
    apply: SHEET_TEXT.remove,
  });

const duplicatesPlan = (bank: PaletteBank): SheetPlan =>
  removalPlan(bank, duplicateGroups(bank).flatMap((group) => group.slice(1)), {
    command: PALETTE_COMMAND_NAME.paletteUniteDuplicates,
    title: SHEET_TEXT.uniteTitle,
    note: SHEET_TEXT.uniteNote,
    label: PANEL_LABEL.unite,
    done: PANEL_TEXT.united,
    apply: SHEET_TEXT.unite,
  });

const gradientPlan = (bank: PaletteBank, first: number, last: number): SheetPlan => {
  const low = Math.min(first, last);
  const high = Math.max(first, last);
  const range = Array.from({ length: high - low + 1 }, (_, at) => low + at);
  const steps = gradientSteps(bank, first, last);
  const middle = steps.map((step) => String((step.options as { rgb: string }).rgb).toUpperCase());
  const after = [...hexes(bank, [low]), ...middle, ...hexes(bank, [high])];
  return { title: RAMP_TEXT.gradientLabel, note: steps.length === 0 ? RAMP_TEXT.gradientShort : SHEET_TEXT.gradientNote(low, high), gone: [], before: hexes(bank, range), after, steps, label: RAMP_TEXT.gradientLabel, done: RAMP_TEXT.gradient(steps.length), apply: SHEET_TEXT.recolour(steps.length) };
};

const sheetPlan = (artwork: Artwork, bank: PaletteBank, sprite: Sprite, request: PaletteSheetRequest): SheetPlan => {
  if (request.kind === 'unused') return unusedPlan(artwork, bank, sprite);
  if (request.kind === 'duplicates') return duplicatesPlan(bank);
  return gradientPlan(bank, request.first, request.last);
};

export { sheetPlan };
