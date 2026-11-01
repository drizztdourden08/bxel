/* @layer renderer-app @kind logic */
import { formatSwatchColor } from '@bxel/document';
import type { PaletteBank, Rgb } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { PANEL_LABEL } from '../palette-panel/palette-panel.constants';
import type { SourceColor } from '../palette-source/palette-source.type';
import { IMPORT_TEXT } from './palette-import.constants';
import type { ImportMode, ImportPlan } from './palette-import.type';

const textOf = (color: SourceColor): string => formatSwatchColor(color.rgb as Rgb, color.alpha);

const colorsOf = (bank: PaletteBank): Set<string> =>
  new Set(bank.slots.flatMap((slot) => (slot.kind === 'color' ? [formatSwatchColor(slot.rgb, slot.alpha)] : [])));

/** What an import would do to this bank: the colours that go in, those already there, those that do not fit. */
const importPlan = (bank: PaletteBank, colors: readonly SourceColor[], mode: ImportMode): ImportPlan => {
  const have = colorsOf(bank);
  const present = colors.filter((color) => have.has(textOf(color)));
  const fresh = mode === 'append' ? colors.filter((color) => !have.has(textOf(color))) : colors;
  const room = mode === 'append' ? Math.max(0, bank.cap - bank.slots.length) : opaqueSlots(bank.cap, bank.transparent);
  const kept = fresh.slice(0, room);
  const options = { bankId: bank.id, colors: kept.map(textOf), mode };
  return {
    mode,
    kept,
    present,
    over: fresh.slice(room),
    steps: kept.length === 0 ? [] : [{ name: PALETTE_COMMAND_NAME.paletteImport, targets: null, options }],
    label: PANEL_LABEL.import,
    done: IMPORT_TEXT.done[mode](kept.length),
    apply: IMPORT_TEXT.apply[mode](kept.length),
  };
};

export { importPlan };
