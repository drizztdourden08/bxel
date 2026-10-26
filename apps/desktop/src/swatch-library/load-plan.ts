/* @layer renderer-app @kind logic */
import { formatSwatchColor } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import { sourceColorText } from '../palette-source/source-color-text';
import type { SourceColor } from '../palette-source/palette-source.type';
import type { LoadMode, LoadPlan } from './swatch-library.type';

const presentColors = (bank: PaletteBank): Set<string> =>
  new Set(bank.slots.flatMap((slot) => (slot.kind === 'color' ? [formatSwatchColor(slot.rgb, slot.alpha).toLowerCase()] : [])));

const distinct = (colors: readonly SourceColor[]): string[] => [...new Set(colors.map((color) => sourceColorText(color).toLowerCase()))];

const appendPlan = (bank: PaletteBank, colors: readonly SourceColor[]): LoadPlan => {
  const present = presentColors(bank);
  const fresh = distinct(colors).filter((text) => !present.has(text));
  const free = Math.max(0, bank.cap - bank.slots.length);
  const kept = fresh.slice(0, free);
  return { mode: 'append', colors: kept, dropped: fresh.length - kept.length, skipped: distinct(colors).length - fresh.length };
};

const replacePlan = (bank: PaletteBank, colors: readonly SourceColor[]): LoadPlan => {
  const all = distinct(colors);
  const room = Math.max(0, bank.cap - (bank.transparent ? 1 : 0));
  const kept = all.slice(0, room);
  return { mode: 'replace', colors: kept, dropped: all.length - kept.length, skipped: 0 };
};

const loadPlan = (bank: PaletteBank, colors: readonly SourceColor[], mode: LoadMode): LoadPlan =>
  mode === 'append' ? appendPlan(bank, colors) : replacePlan(bank, colors);

export { loadPlan };
