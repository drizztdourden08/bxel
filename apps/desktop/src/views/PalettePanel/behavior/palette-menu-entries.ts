/* @layer renderer-app @kind logic */
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
import { currentContext } from '../../../ui-context/current-context';
import { useToolStore } from '../../../stores/useToolStore';
import { PALETTE_MENU, SWATCH_SELECTOR } from '../PalettePanel.constants';
import { POSITIONS } from './palette-menu-entries.constants';

const pixelSurface = (): boolean => currentContext().surface === 'pixel';

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

const panelEntries: readonly ContextMenuEntry[] = [
  COMMAND_ID.swapColours,
  COMMAND_ID.swapColourPairs,
  DIALOG_COMMAND.changeLimit,
  { command: ASSET_SETTINGS_COMMAND, label: PALETTE_MENU.settings },
];

const paletteMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const bank = currentTarget()?.bank;
  const slots = bank ? paletteSlots(bank) : [];
  const swatch = menuTarget(context, SWATCH_SELECTOR)?.dataset.swatchIndex;
  const chip = menuTarget(context, '[data-held-slot]')?.dataset.heldSlot;
  const clicked = swatch === undefined ? undefined : slots[Number(swatch)];
  if (clicked) return swatchEntries(clicked);
  if (chip !== undefined) return chipEntries(Number(chip), slots[heldIndex(Number(chip)) ?? -1]);
  return panelEntries;
};

export { paletteMenuEntries };
