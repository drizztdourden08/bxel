/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { rampsOfSlot } from '@bxel/palette';
import { unless } from '../../../context-menu/unless';
import { PALETTE_TRANSFER_COMMAND } from '../../../keymap/palette-transfer-command-id.constants';
import { REPLACE_TEXT } from '../../../palette-panel/palette-panel.constants';
import type { ReplaceScope } from '../../../palette-panel/palette-panel.type';
import { currentContext } from '../../../ui-context/current-context';

const SCOPES: readonly ReplaceScope[] = ['frame', 'sprite', 'animation', 'selection'];

const scopeEntries = (command: string, args: object): ContextMenuEntry[] =>
  SCOPES.map((scope) => ({ command, label: REPLACE_TEXT[scope], args: { ...args, scope } }));

/** Replace with front colour and Replace ramp, each with the scope it works in. Hidden away from the pixel canvas. */
const replaceEntries = (bank: PaletteBank, index: number, transparent: boolean): readonly ContextMenuEntry[] => {
  if (currentContext().surface !== 'pixel') return [];
  const own = rampsOfSlot(bank, index)[0];
  const others = own ? bank.ramps.filter((ramp) => ramp.id !== own.id) : [];
  const ramp: ContextMenuEntry =
    own && others.length > 0
      ? { label: REPLACE_TEXT.ramp, items: others.map((to) => ({ label: to.name, items: scopeEntries(PALETTE_TRANSFER_COMMAND.replaceRamp, { from: own.name, to: to.name }) })) }
      : { command: PALETTE_TRANSFER_COMMAND.replaceRamp, label: REPLACE_TEXT.ramp, ...unless(false, own ? REPLACE_TEXT.noRamp : REPLACE_TEXT.notInRamp) };
  return [
    transparent
      ? { command: PALETTE_TRANSFER_COMMAND.replaceFront, label: REPLACE_TEXT.front, ...unless(false, 'The transparent swatch has no colour value.') }
      : { label: REPLACE_TEXT.front, items: scopeEntries(PALETTE_TRANSFER_COMMAND.replaceFront, { index }) },
    ramp,
  ];
};

export { replaceEntries };
