/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { MapLayerId, TilemapId } from '../../model/ids.type';
import type { Tilemap } from '../../model/tilemap.type';
import { tilemapDuplicateSchema } from '../../schema/tilemap-duplicate-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { freeName } from '../layer/free-name';
import { COPY_SUFFIX } from '../layer/layer.constants';
import { pickTilemap } from './pick-tilemap';

const tilemapDuplicate = defineCommand({
  name: COMMAND_NAME.tilemapDuplicate,
  scope: 'none',
  schema: tilemapDuplicateSchema,
  run: (draft, input) => {
    const source = pickTilemap(draft, input.options.tilemap);
    const taken = draft.artwork.tilemaps.map((tilemap) => tilemap.name);
    const name = input.options.name === undefined ? freeName(taken, `${source.name}${COPY_SUFFIX}`) : checkName(input.options.name);
    assertNameFree(taken, name);
    const layers = source.layers.map((layer) => ({ ...layer, id: draft.ids.next('tml') as MapLayerId, cells: layer.cells.slice() }));
    const copy: Tilemap = { ...source, id: draft.ids.next('tlm') as TilemapId, name, layers };
    updateArtwork(draft, (artwork) => ({ ...artwork, tilemaps: [...artwork.tilemaps, copy] }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { tilemapDuplicate };
