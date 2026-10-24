/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import { sheetExtent, sheetSizes } from '@bxel/document';
import type { Artwork, PaletteBank, Sheet } from '@bxel/document';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import { spriteSummary } from './sprite-summary';
import type { GetDocumentInput } from './tool-input.type';
import { viewFor } from './view-for';

const bankSummary = (bank: PaletteBank) => ({
  bankId: bank.id,
  name: bank.name,
  cap: bank.cap,
  used: bank.slots.length,
  transparent: bank.transparent,
});

const sheetSummary = (artwork: Artwork) => (sheet: Sheet) => ({
  sheetId: sheet.id,
  name: sheet.name,
  ...sheetExtent(sheet, sheetSizes(artwork)),
  entries: sheet.entries.length,
});

const getDocument: ToolHandler = (input, context) => {
  const { documentId, spriteOffset, spriteLimit } = input as GetDocumentInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const { artwork, revision } = view.state;
  const hidden = hiddenAssets(context, documentId);
  const seen = artwork.sprites.filter((sprite) => !hidden.has(sprite.id));
  const sprites = seen.slice(spriteOffset, spriteOffset + spriteLimit);
  return reply({
    ok: true,
    documentId,
    revision,
    name: artwork.name,
    canUndo: view.canUndo,
    canRedo: view.canRedo,
    undoIsOwn: view.newest?.actor === context.call.session.sessionId,
    banks: artwork.banks.filter((bank) => !hidden.has(bank.id)).map(bankSummary),
    sprites: sprites.map(spriteSummary),
    spritesTotal: seen.length,
    truncated: spriteOffset + sprites.length < seen.length,
    sheets: artwork.sheets.filter((sheet) => !hidden.has(sheet.id)).map(sheetSummary(artwork)),
  });
};

export { getDocument };
