/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { AssetSlice } from '../model/asset.type';
import type { TilemapId } from '../model/ids.type';
import { requireTilemap } from '../read/require-tilemap';
import { linkTo } from './link-to';
import type { SliceContext } from './slice-context.type';

const sliceTilemap = (context: SliceContext, id: string): AssetSlice => {
  const tilemap = requireTilemap(context.artwork, id as TilemapId);
  return {
    kind: ASSET_KIND.tilemap,
    id,
    name: tilemap.name,
    artwork: { tilemaps: [tilemap] },
    links: linkTo(context, [tilemap.tilesetId]),
  };
};

export { sliceTilemap };
