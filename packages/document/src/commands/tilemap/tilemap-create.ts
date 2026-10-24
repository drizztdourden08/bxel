/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import { DEFAULT_LAYER_NAME } from '../../model/limits.constants';
import type { TilemapId } from '../../model/ids.type';
import type { Tilemap } from '../../model/tilemap.type';
import { tilemapCreateSchema } from '../../schema/tilemap-create-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from '../layer/choose-layer-name';
import { buildMapLayer } from './build-map-layer';
import { checkMapSize } from './check-map-size';
import { pickTileset } from './pick-tileset';

const tilemapCreate = defineCommand({
  name: COMMAND_NAME.tilemapCreate,
  scope: 'none',
  schema: tilemapCreateSchema,
  run: (draft, input) => {
    const { options } = input;
    const tileset = pickTileset(draft, options.tileset);
    const name = checkName(options.name);
    assertNameFree(
      draft.artwork.tilemaps.map((tilemap) => tilemap.name),
      name,
    );
    checkMapSize({ width: options.columns, height: options.rows });
    const layerName = chooseLayerName(options.layerName, [], DEFAULT_LAYER_NAME);
    const tilemap: Tilemap = {
      id: draft.ids.next('tlm') as TilemapId,
      name,
      tilesetId: tileset.id,
      columns: options.columns,
      rows: options.rows,
      layers: [buildMapLayer(draft.ids, layerName, options.columns * options.rows)],
    };
    updateArtwork(draft, (artwork) => ({ ...artwork, tilemaps: [...artwork.tilemaps, tilemap] }));
    registerRef(draft, input.ref, tilemap.id);
  },
});

export { tilemapCreate };
