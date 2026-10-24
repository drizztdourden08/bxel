/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { TilesetId } from '../../model/ids.type';
import type { Tileset } from '../../model/tilemap.type';
import { tilesetDuplicateSchema } from '../../schema/tileset-duplicate-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { freeName } from '../layer/free-name';
import { COPY_SUFFIX } from '../layer/layer.constants';
import { pickTileset } from '../tilemap/pick-tileset';
import { copyTiles } from './copy-tiles';

const tilesetDuplicate = defineCommand({
  name: COMMAND_NAME.tilesetDuplicate,
  scope: 'none',
  schema: tilesetDuplicateSchema,
  run: (draft, input) => {
    const source = pickTileset(draft, input.options.tileset);
    const taken = draft.artwork.tilesets.map((tileset) => tileset.name);
    const name = input.options.name === undefined ? freeName(taken, `${source.name}${COPY_SUFFIX}`) : checkName(input.options.name);
    assertNameFree(taken, name);
    const tiles = copyTiles(draft, source);
    const copy: Tileset = { ...source, id: draft.ids.next('tls') as TilesetId, name, tiles };
    updateArtwork(draft, (artwork) => ({ ...artwork, tilesets: [...artwork.tilesets, copy] }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { tilesetDuplicate };
