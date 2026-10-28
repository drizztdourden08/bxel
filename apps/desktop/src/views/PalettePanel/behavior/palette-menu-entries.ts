/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_SETTINGS_COMMAND } from '../../../config-entry/config-entry.constants';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { currentTarget } from '../../../editor/current-target';
import { HELD_SLOTS } from '../../../editor/held-colours.constants';
import { paletteSlots } from '../../../editor/palette-slots';
import type { PaletteSlot } from '../../../editor/palette-slots.type';
import { DIALOG_COMMAND } from '../../../keymap/dialog-command-id.constants';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { currentSurface } from '../../../surface/current-surface';
import { PANEL_COMMAND } from '../../../palette-panel/palette-panel.constants';
import { selectedIndices } from '../../../palette-panel/selected-indices';
import { useToolStore } from '../../../stores/useToolStore';
import { PALETTE_MENU, SWATCH_SELECTOR } from '../PalettePanel.constants';
import { POSITIONS } from './palette-menu-entries.constants';

const pixelSurface = (): boolean => ['sprite', 'tile'].includes(currentSurface());

const heldIndex = (position: number): number | undefined => {
  const slot = HELD_SLOTS[position - 1];
  return slot === undefined ? undefined : useToolStore.getState()[slot];
};

const swatchEntries = (slot: PaletteSlot): readonly ContextMenuEntry[] => {
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

const selectionEntries = (count: number): readonly ContextMenuEntry[] => [
  { command: PANEL_COMMAND.make, label: PALETTE_MENU.makeRamp },
  { command: PANEL_COMMAND['make-light'], label: PALETTE_MENU.makeRampLight },
  { command: PANEL_COMMAND.gradient, label: PALETTE_MENU.gradient, ...unless(count === 2, PALETTE_MENU.gradientTwo) },
  { command: PANEL_COMMAND.sort, label: PALETTE_MENU.sortSelection },
  'separator',
];

const panelEntries: readonly ContextMenuEntry[] = [
  { command: PANEL_COMMAND.add, label: PALETTE_MENU.addColour },
  { command: PANEL_COMMAND.ramp, label: PALETTE_MENU.newRamp },
  { command: PANEL_COMMAND.unused, label: PALETTE_MENU.removeUnused },
  { command: PANEL_COMMAND.duplicates, label: PALETTE_MENU.unite },
  'separator',
  COMMAND_ID.swapColours,
  COMMAND_ID.swapColourPairs,
  DIALOG_COMMAND.changeLimit,
  { command: ASSET_SETTINGS_COMMAND, label: PALETTE_MENU.settings },
];

const clickedEntries = (bank: PaletteBank, clicked: PaletteSlot): readonly ContextMenuEntry[] => {
  const selection = selectedIndices(bank);
  const many = selection.length > 1 && selection.includes(clicked.index);
  return many ? [...selectionEntries(selection.length), ...swatchEntries(clicked)] : swatchEntries(clicked);
};

const paletteMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const bank = currentTarget()?.bank;
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
