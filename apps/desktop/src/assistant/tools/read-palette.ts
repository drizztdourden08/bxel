/* @layer renderer-app @kind logic */
import { BACKGROUND_LABEL, ERROR_CODE, findBank, swatchAlpha } from '@bxel/document';
import type { Artwork, BankId, PaletteBank, Swatch } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import { bankSprites } from '../../palette-panel/bank-sprites';
import { duplicateGroups } from '../../palette-panel/duplicate-groups';
import { slotUsage } from '../../palette-panel/slot-usage';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import type { ReadPaletteInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const slotOf = (swatch: Swatch, index: number) =>
  swatch.kind === 'transparent'
    ? { index, swatchId: swatch.id, hex: null, alpha: swatchAlpha(swatch), name: BACKGROUND_LABEL }
    : { index, swatchId: swatch.id, hex: swatch.rgb.toUpperCase(), alpha: swatchAlpha(swatch), name: swatch.name };

const rampsOf = (bank: PaletteBank) =>
  bank.ramps.map((ramp) => ({
    rampId: ramp.id,
    name: ramp.name,
    indexes: ramp.swatches.map((id) => bank.slots.findIndex((slot) => slot.id === id)).filter((index) => index >= 0),
  }));

const extrasOf = (artwork: Artwork, bank: PaletteBank, include: ReadPaletteInput['include'] = []) => {
  const wants = new Set(include);
  const sprites = bankSprites(artwork, bank.id);
  const usage = wants.has('usage') ? { usage: slotUsage(sprites, bank.slots.length).map((use, index) => ({ index, ...use })) } : {};
  const duplicates = wants.has('duplicates') ? { duplicates: duplicateGroups(bank) } : {};
  const sharing = wants.has('sharing') ? { sharing: { shared: sprites.length > 1, sprites: sprites.map((sprite) => ({ spriteId: sprite.id, name: sprite.name })) } } : {};
  return { ...usage, ...duplicates, ...sharing };
};

const readPalette: ToolHandler = (input, context) => {
  const { documentId, bankId, include } = input as ReadPaletteInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const { artwork, revision } = view.state;
  const bank = findBank(artwork, (bankId ?? artwork.defaultBankId) as BankId);
  if (!bank || hiddenAssets(context, documentId).has(bank.id)) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound));
  return reply({
    ok: true,
    revision,
    bankId: bank.id,
    name: bank.name,
    cap: bank.cap,
    transparent: bank.transparent,
    slots: bank.slots.map(slotOf),
    ramps: rampsOf(bank),
    ...extrasOf(artwork, bank, include),
  });
};

export { readPalette };
