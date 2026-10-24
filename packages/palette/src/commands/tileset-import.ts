/* @layer core @kind logic */
import { defineCommand, ERROR_CODE, fail, tileAdd, tilesetCreate } from '@bxel/document';
import type { Draft, TilesetId } from '@bxel/document';
import { mapImportImage } from './map-import-image';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { resolveImportBank } from './resolve-import-bank';
import { tilesetImportSchema } from './tileset-import-schema';
import { writeImportCel } from './write-import-cel';

const lastTilesetId = (draft: Draft): TilesetId => {
  const tileset = draft.artwork.tilesets.at(-1);
  if (!tileset) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'The imported tileset was not created.');
  return tileset.id;
};

const tilesetImport = defineCommand({
  name: PALETTE_COMMAND_NAME.tilesetImport,
  scope: 'none',
  schema: tilesetImportSchema,
  run: (draft, input) => {
    const { name, tileWidth, tileHeight, tiles, mapping } = input.options;
    const bank = resolveImportBank(draft, input.options.bank);
    const shared = { ...input, sprites: [], cels: [] };
    tilesetCreate.run(draft, { ...shared, options: { name, tileWidth, tileHeight, bankId: bank.id } });
    const tileset = lastTilesetId(draft);
    tiles.forEach((tile, at) => {
      if (tile.image.width !== tileWidth || tile.image.height !== tileHeight) {
        throw fail(ERROR_CODE.INVALID_OPTION, `Tile ${at + 1} is not ${tileWidth} x ${tileHeight}.`, { path: `options.tiles.${at}.image` });
      }
      tileAdd.run(draft, { ...shared, ref: undefined, options: { tileset } });
      const sprite = draft.artwork.sprites.at(-1);
      if (!sprite) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'The imported tile was not created.');
      const placed = { ...mapping, originX: tile.originX, originY: tile.originY };
      writeImportCel(draft, sprite, mapImportImage(tile.image, bank, placed));
    });
  },
});

export { tilesetImport };
