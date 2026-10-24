/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Tileset } from '../../model/tilemap.type';

const suppliedTileset = (slice: AssetSlice | null, tilesetId: string): Tileset | null => {
  if (slice?.kind !== ASSET_KIND.tileset) return null;
  return slice.artwork.tilesets?.find((item) => item.id === tilesetId) ?? null;
};

export { suppliedTileset };
