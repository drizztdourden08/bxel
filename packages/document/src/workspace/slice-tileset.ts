/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { AssetSlice } from '../model/asset.type';
import type { TilesetId } from '../model/ids.type';
import { requireBank } from '../read/require-bank';
import { requireSprite } from '../read/require-sprite';
import { requireTileset } from '../read/require-tileset';
import { linkTo } from './link-to';
import type { SliceContext } from './slice-context.type';

const sliceTileset = (context: SliceContext, id: string): AssetSlice => {
  const { artwork } = context;
  const tileset = requireTileset(artwork, id as TilesetId);
  const bank = requireBank(artwork, tileset.bankId);
  return {
    kind: ASSET_KIND.tileset,
    id,
    name: tileset.name,
    artwork: {
      banks: [bank],
      sprites: tileset.tiles.map((tile) => requireSprite(artwork, tile.spriteId)),
      tilesets: [tileset],
    },
    links: linkTo(context, [bank.id]),
  };
};

export { sliceTileset };
