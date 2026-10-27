/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import { sheetExtent, sheetSizes } from '@bxel/document';
import type { Animation, Artwork, PaletteBank, Sheet, Tilemap, Tileset } from '@bxel/document';
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

const animationSummary = (animation: Animation) => ({
  animationId: animation.id,
  name: animation.name,
  width: animation.width,
  height: animation.height,
  frames: animation.frames.length,
  tags: animation.tags.length,
});

const tilesetSummary = (tileset: Tileset) => ({
  tilesetId: tileset.id,
  name: tileset.name,
  bankId: tileset.bankId,
  tileWidth: tileset.tileWidth,
  tileHeight: tileset.tileHeight,
  tiles: tileset.tiles.length,
});

const tilemapSummary = (tilemap: Tilemap) => ({
  tilemapId: tilemap.id,
  name: tilemap.name,
  tilesetId: tilemap.tilesetId,
  columns: tilemap.columns,
  rows: tilemap.rows,
  layers: tilemap.layers.length,
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
  const seen = artwork.sprites.filter((sprite) => sprite.role !== 'frame' && !hidden.has(sprite.id));
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
    animations: artwork.animations.filter((animation) => !hidden.has(animation.id)).map(animationSummary),
    sheets: artwork.sheets.filter((sheet) => !hidden.has(sheet.id)).map(sheetSummary(artwork)),
    tilesets: artwork.tilesets.filter((tileset) => !hidden.has(tileset.id)).map(tilesetSummary),
    tilemaps: artwork.tilemaps.filter((tilemap) => !hidden.has(tilemap.id)).map(tilemapSummary),
  });
};

export { getDocument };
