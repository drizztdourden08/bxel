/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { BankId, TilesetId } from '../../model/ids.type';
import type { Tileset } from '../../model/tilemap.type';
import { requireBank } from '../../read/require-bank';
import { tilesetCreateSchema } from '../../schema/tileset-create-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { checkSize } from '../../validate/check-size';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const tilesetCreate = defineCommand({
  name: COMMAND_NAME.tilesetCreate,
  scope: 'none',
  schema: tilesetCreateSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = checkName(options.name);
    checkSize({ width: options.tileWidth, height: options.tileHeight });
    assertNameFree(
      draft.artwork.tilesets.map((tileset) => tileset.name),
      name,
    );
    const bankId = (options.bankId ?? draft.artwork.defaultBankId) as BankId;
    requireBank(draft.artwork, bankId);
    const tileset: Tileset = {
      id: draft.ids.next('tls') as TilesetId,
      name,
      created: draft.stamp,
      bankId,
      tileWidth: options.tileWidth,
      tileHeight: options.tileHeight,
      nextKey: 1,
      tiles: [],
    };
    updateArtwork(draft, (artwork) => ({ ...artwork, tilesets: [...artwork.tilesets, tileset] }));
    registerRef(draft, input.ref, tileset.id);
  },
});

export { tilesetCreate };
