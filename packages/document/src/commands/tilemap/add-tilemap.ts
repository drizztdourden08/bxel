/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { TilemapId } from '../../model/ids.type';
import type { MapLayer, Tilemap } from '../../model/tilemap.type';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { checkMapSize } from './check-map-size';
import type { TilemapRequest } from './tilemap-request.type';
import { normalizeOrientation } from './normalize-orientation';
import { pickTileset } from './pick-tileset';

const addTilemap = (draft: Draft, ref: string | undefined, request: TilemapRequest, layersOf: () => MapLayer[]): void => {
  const tileset = pickTileset(draft, request.tileset);
  const name = checkName(request.name);
  assertNameFree(
    draft.artwork.tilemaps.map((tilemap) => tilemap.name),
    name,
  );
  checkMapSize({ width: request.columns, height: request.rows });
  const orientation = normalizeOrientation(request.orientation, tileset, 'options.orientation');
  const tilemap: Tilemap = {
    id: draft.ids.next('tlm') as TilemapId,
    name,
    created: draft.stamp,
    tilesetId: tileset.id,
    columns: request.columns,
    rows: request.rows,
    layers: layersOf(),
    ...(orientation ? { orientation } : {}),
  };
  updateArtwork(draft, (artwork) => ({ ...artwork, tilemaps: [...artwork.tilemaps, tilemap] }));
  registerRef(draft, ref, tilemap.id);
};

export { addTilemap };
