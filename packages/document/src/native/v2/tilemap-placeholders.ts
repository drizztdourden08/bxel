/* @layer core @kind logic */
import type { AssetContent, AssetRef } from '../../model/asset.type';
import type { TilesetId } from '../../model/ids.type';
import { placeholderBank } from './placeholder-bank';
import { placeholderName } from './placeholder-name';
import { PLACEHOLDER_TILESET_NAME, PLACEHOLDER_TILE_SIZE } from './placeholder.constants';

const tilemapPlaceholders = (link: AssetRef): AssetContent => {
  const bank = placeholderBank(link.id);
  const tileset = {
    id: link.id as TilesetId,
    name: placeholderName(link.path, PLACEHOLDER_TILESET_NAME),
    bankId: bank.id,
    tileWidth: PLACEHOLDER_TILE_SIZE,
    tileHeight: PLACEHOLDER_TILE_SIZE,
    nextKey: 1,
    tiles: [],
  };
  return { banks: [bank], tilesets: [tileset] };
};

export { tilemapPlaceholders };
