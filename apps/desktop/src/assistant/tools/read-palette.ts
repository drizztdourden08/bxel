/* @layer renderer-app @kind logic */
import { BACKGROUND_LABEL, ERROR_CODE, findBank } from '@bxel/document';
import type { BankId, PaletteBank, Swatch } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';
import type { ReadPaletteInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const slotOf = (swatch: Swatch, index: number) =>
  swatch.kind === 'transparent'
    ? { index, swatchId: swatch.id, hex: null, name: BACKGROUND_LABEL }
    : { index, swatchId: swatch.id, hex: swatch.rgb.toUpperCase(), name: swatch.name };

const rampsOf = (bank: PaletteBank) =>
  bank.ramps.map((ramp) => ({
    rampId: ramp.id,
    name: ramp.name,
    indexes: ramp.swatches.map((id) => bank.slots.findIndex((slot) => slot.id === id)).filter((index) => index >= 0),
  }));

const readPalette: ToolHandler = (input, context) => {
  const { documentId, bankId } = input as ReadPaletteInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const { artwork, revision } = view.state;
  const bank = findBank(artwork, (bankId ?? artwork.defaultBankId) as BankId);
  if (!bank) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound));
  return reply({
    ok: true,
    revision,
    bankId: bank.id,
    name: bank.name,
    cap: bank.cap,
    transparent: bank.transparent,
    slots: bank.slots.map(slotOf),
    ramps: rampsOf(bank),
  });
};

export { readPalette };
