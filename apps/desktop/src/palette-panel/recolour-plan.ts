/* @layer renderer-app @kind logic */
import { COMMAND_NAME, swatchAlpha } from '@bxel/document';
import type { CommandStep, PaletteBank } from '@bxel/document';
import { paletteSlots } from '../editor/palette-slots';
import { RECOLOUR_TEXT, SHEET_TEXT } from './palette-panel.constants';
import type { SheetPlan } from './palette-panel.type';

interface Look {
  rgb: string;
  alpha: number;
}

const lookAt = (bank: PaletteBank, index: number): Look | null => {
  const slot = bank.slots[index];
  return slot?.kind === 'color' ? { rgb: slot.rgb, alpha: swatchAlpha(slot) } : null;
};

const updateStep = (bank: PaletteBank, index: number, look: Look): CommandStep[] => {
  const slot = bank.slots[index];
  if (slot?.kind !== 'color') return [];
  return [{ name: COMMAND_NAME.swatchUpdate, targets: null, options: { bankId: bank.id, swatchId: slot.id, rgb: look.rgb, alpha: look.alpha } }];
};

const hexesOf = (bank: PaletteBank, indices: readonly number[]): string[] => {
  const slots = paletteSlots(bank);
  return indices.map((index) => slots[index]?.hex ?? '');
};

const span = (from: number, to: number): number[] => {
  const low = Math.min(from, to);
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, at) => low + at);
};

/** The colour values after a move: the colour at from goes to to, the ones between shift by one. Indexes stay. */
const movedLooks = (bank: PaletteBank, from: number, to: number): Map<number, Look> => {
  const range = span(from, to);
  const looks = range.map((index) => lookAt(bank, index));
  const moving = looks[from - Math.min(from, to)] ?? null;
  const rest = looks.filter((_, at) => range[at] !== from);
  const order = to > from ? [...rest, moving] : [moving, ...rest];
  const result = new Map<number, Look>();
  range.forEach((index, at) => {
    const look = order[at];
    if (look) result.set(index, look);
  });
  return result;
};

const valid = (bank: PaletteBank, index: number): boolean => index > 0 && lookAt(bank, index) !== null;

const planOf = (bank: PaletteBank, indices: readonly number[], steps: readonly CommandStep[], words: { title: string; note: string; label: string; done: string }, after: readonly string[]): SheetPlan => ({
  title: words.title,
  note: words.note,
  gone: [],
  before: hexesOf(bank, indices),
  after,
  steps,
  label: words.label,
  done: words.done,
  apply: SHEET_TEXT.recolour(steps.length),
});

/** Copies the colour of one swatch over another. Pixels keep their index, so the ones that use the target change colour. */
const copyOverPlan = (bank: PaletteBank, from: number, to: number): SheetPlan => {
  const look = lookAt(bank, from);
  const ok = look !== null && from !== to && valid(bank, to);
  const steps = ok ? updateStep(bank, to, look) : [];
  const words = { title: RECOLOUR_TEXT.copyTitle, note: ok ? RECOLOUR_TEXT.copyNote(from, to) : RECOLOUR_TEXT.copyNone, label: RECOLOUR_TEXT.copyLabel, done: RECOLOUR_TEXT.copyDone(to) };
  return planOf(bank, [from, to], steps, words, ok ? [...hexesOf(bank, [from]), ...hexesOf(bank, [from])] : []);
};

/** Moves a colour value to another place in the list while every index stays where it is, so the drawing changes. */
const moveColourPlan = (bank: PaletteBank, from: number, to: number): SheetPlan => {
  const ok = from !== to && valid(bank, from) && valid(bank, to);
  const looks = ok ? movedLooks(bank, from, to) : new Map<number, Look>();
  const range = span(from, to);
  const steps = [...looks].flatMap(([index, look]) => (lookAt(bank, index)?.rgb === look.rgb && lookAt(bank, index)?.alpha === look.alpha ? [] : updateStep(bank, index, look)));
  const after = range.map((index) => looks.get(index)?.rgb.toUpperCase() ?? hexesOf(bank, [index])[0] ?? '');
  const words = { title: RECOLOUR_TEXT.moveTitle, note: ok ? RECOLOUR_TEXT.moveNote(from, to) : RECOLOUR_TEXT.moveNone, label: RECOLOUR_TEXT.moveLabel, done: RECOLOUR_TEXT.moveDone(from, to) };
  return planOf(bank, range, ok ? steps : [], words, ok ? after : []);
};

export { copyOverPlan, moveColourPlan };
