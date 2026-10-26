/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import type { Animation } from '../../model/animation.type';
import type { TagId } from '../../model/ids.type';
import type { Tileset } from '../../model/tilemap.type';
import { placeholderAnimation } from './placeholder-animation';

const tilesetPlaceholders = (tileset: Tileset, missing: readonly AssetRef[]): readonly Animation[] =>
  missing.map((link) => {
    const tags = tileset.tiles.flatMap((tile) =>
      tile.animation?.animationId === link.id && tile.animation.tagId !== null ? [tile.animation.tagId] : [],
    );
    const size = { width: tileset.tileWidth, height: tileset.tileHeight };
    return placeholderAnimation(link, size, tileset.bankId, [...new Set<TagId>(tags)]);
  });

export { tilesetPlaceholders };
