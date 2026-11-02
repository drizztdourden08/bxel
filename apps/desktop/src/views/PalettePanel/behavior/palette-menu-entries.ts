/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_SETTINGS_COMMAND } from '../../../config-entry/config-entry.constants';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { currentPaletteTarget } from '../../../palette-panel/current-palette-target';
import { HELD_SLOTS } from '../../../editor/held-colours.constants';
import { paletteSlots } from '../../../editor/palette-slots';
import type { PaletteSlot } from '../../../editor/palette-slots.type';
import { DIALOG_COMMAND } from '../../../keymap/dialog-command-id.constants';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { PALETTE_TRANSFER_COMMAND } from '../../../keymap/palette-transfer-command-id.constants';
import { PALETTE_EXPORT_FORMATS, PALETTE_EXPORT_TEXT } from '../../../palette-export/palette-export.constants';
import { PANEL_COMMAND } from '../../../palette-panel/palette-panel.constants';
import { selectedIndices } from '../../../palette-panel/selected-indices';
import { currentContext } from '../../../ui-context/current-context';
import { useToolStore } from '../../../stores/useToolStore';
import { PALETTE_MENU, SWATCH_SELECTOR } from '../PalettePanel.constants';
import { POSITIONS } from './palette-menu-entries.constants';
import { replaceEntries } from './replace-entries';

const pixelSurface = (): boolean => currentContext().surface === 'pixel';

const heldIndex = (position: number): number | undefined => {
  const slot = HELD_SLOTS[position - 1];
  return slot === undefined ? undefined : useToolStore.getState()[slot];
};

const rampEntry = (bank: PaletteBank, slot: PaletteSlot): ContextMenuEntry => {
  const id = bank.slots[slot.index]?.id;
  const open = bank.ramps.filter((ramp) => id !== undefined && !ramp.swatches.includes(id));
  if (slot.transparent) return { command: PALETTE_TRANSFER_COMMAND.addToRamp, label: PALETTE_MENU.addToRamp, ...unless(false, PALETTE_MENU.transparent) };
  if (open.length === 0) {
    return { command: PALETTE_TRANSFER_COMMAND.addToRamp, label: PALETTE_MENU.addToRamp, ...unless(false, bank.ramps.length === 0 ? PALETTE_MENU.noRampToAdd : PALETTE_MENU.inEveryRamp) };
  }
  return { label: PALETTE_MENU.addToRamp, items: open.map((ramp) => ({ command: PALETTE_TRANSFER_COMMAND.addToRamp, label: ramp.name, args: { index: slot.index, ramp: ramp.name } })) };
};

const swatchEntries = (slot: PaletteSlot, bank: PaletteBank): readonly ContextMenuEntry[] => {
  const args = { index: slot.index };
  const fixed = slot.transparent || slot.index === 0;
  return [
    ...POSITIONS.map((position) => ({
      command: 'palette.use_as',
      label: PALETTE_MENU.useAs(position),
      args: { slot: position, index: slot.index },
      checked: heldIndex(position) === slot.index,
    })),
    'separator',
    { command: 'palette.edit_swatch', label: PALETTE_MENU.edit, args, ...unless(!slot.transparent, PALETTE_MENU.transparent) },
    { command: 'selection.by_colour', label: PALETTE_MENU.select, args: { index: slot.index, mode: 'everywhere' }, hidden: !pixelSurface() },
    { command: 'palette.copy_hex', label: PALETTE_MENU.copy, args, ...unless(!slot.transparent, PALETTE_MENU.transparent) },
    { command: PANEL_COMMAND.ramp, label: PALETTE_MENU.newRampFrom, args, ...unless(!slot.transparent, PALETTE_MENU.transparent) },
    rampEntry(bank, slot),
    ...replaceEntries(bank, slot.index, slot.transparent),
    { command: PALETTE_TRANSFER_COMMAND.moveColour, label: PALETTE_MENU.moveColour, args, ...unless(!fixed, PALETTE_MENU.fixed) },
    { command: DIALOG_COMMAND.mergeSwatch, label: PALETTE_MENU.merge, args, ...unless(!fixed, PALETTE_MENU.fixed) },
    'separator',
    { command: DIALOG_COMMAND.deleteSwatch, label: PALETTE_MENU.remove, args, tone: 'danger', ...unless(!fixed, PALETTE_MENU.fixed) },
  ];
};

const chipEntries = (position: number, slot: PaletteSlot | undefined): readonly ContextMenuEntry[] => {
  const args = { slot: position };
  const empty = slot === undefined;
  return [
    { command: 'palette.edit_swatch', label: PALETTE_MENU.edit, args, ...unless(!empty && !slot.transparent, PALETTE_MENU.transparent) },
    { command: 'palette.reveal_swatch', label: PALETTE_MENU.reveal, args, ...unless(!empty, PALETTE_MENU.emptyChip) },
    { command: 'selection.by_colour', label: PALETTE_MENU.select, args: { index: heldIndex(position), mode: 'everywhere' }, hidden: !pixelSurface() },
    { command: 'palette.copy_hex', label: PALETTE_MENU.copy, args, ...unless(!empty && !slot.transparent, PALETTE_MENU.transparent) },
    'separator',
    COMMAND_ID.swapColours,
    COMMAND_ID.swapColourPairs,
    COMMAND_ID.colourBack,
    COMMAND_ID.colourForward,
  ];
};

const exportEntries = (selection: boolean): ContextMenuEntry[] =>
  PALETTE_EXPORT_FORMATS.map((format) => ({ command: PALETTE_TRANSFER_COMMAND.export, label: format.label, args: { format: format.id, selection } }));

const selectionEntries = (count: number): readonly ContextMenuEntry[] => [
  { command: PANEL_COMMAND.make, label: PALETTE_MENU.makeRamp },
  { command: PANEL_COMMAND['make-light'], label: PALETTE_MENU.makeRampLight },
  { command: PANEL_COMMAND.gradient, label: PALETTE_MENU.gradient, ...unless(count === 2, PALETTE_MENU.gradientTwo) },
  { command: PANEL_COMMAND.sort, label: PALETTE_MENU.sortSelection },
  { label: PALETTE_EXPORT_TEXT.menuSelection, items: exportEntries(true) },
  { command: PALETTE_TRANSFER_COMMAND.copyList, label: PALETTE_EXPORT_TEXT.copyList, args: { selection: true } },
  'separator',
];

const panelEntries: readonly ContextMenuEntry[] = [
  { command: PANEL_COMMAND.add, label: PALETTE_MENU.addColour },
  { command: PANEL_COMMAND.ramp, label: PALETTE_MENU.newRamp },
  { command: PANEL_COMMAND.unused, label: PALETTE_MENU.removeUnused },
  { command: PANEL_COMMAND.duplicates, label: PALETTE_MENU.unite },
  'separator',
  { command: PALETTE_TRANSFER_COMMAND.import, label: PALETTE_MENU.import },
  { label: PALETTE_EXPORT_TEXT.menu, items: exportEntries(false) },
  { command: PALETTE_TRANSFER_COMMAND.copyList, label: PALETTE_EXPORT_TEXT.copyList },
  'separator',
  COMMAND_ID.swapColours,
  COMMAND_ID.swapColourPairs,
  DIALOG_COMMAND.changeLimit,
  { command: ASSET_SETTINGS_COMMAND, label: PALETTE_MENU.settings },
];

const clickedEntries = (bank: PaletteBank, clicked: PaletteSlot): readonly ContextMenuEntry[] => {
  const selection = selectedIndices(bank);
  const many = selection.length > 1 && selection.includes(clicked.index);
  return many ? [...selectionEntries(selection.length), ...swatchEntries(clicked, bank)] : swatchEntries(clicked, bank);
};

const paletteMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const bank = currentPaletteTarget()?.bank;
  if (!bank) return panelEntries;
  const slots = paletteSlots(bank);
  const swatch = menuTarget(context, SWATCH_SELECTOR)?.dataset.swatchIndex;
  const chip = menuTarget(context, '[data-held-slot]')?.dataset.heldSlot;
  const clicked = swatch === undefined ? undefined : slots[Number(swatch)];
  if (clicked) return clickedEntries(bank, clicked);
  if (chip !== undefined) return chipEntries(Number(chip), slots[heldIndex(Number(chip)) ?? -1]);
  return panelEntries;
};

export { paletteMenuEntries };
