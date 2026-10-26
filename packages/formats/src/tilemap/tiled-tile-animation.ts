/* @layer core @kind logic */
import { tiledGridId } from './tiled-grid-id';
import type { TileAnimationEntry, TilemapExportInput } from './tilemap.type';

const tiledTileAnimation = (
  input: TilemapExportInput,
  animation: TileAnimationEntry,
): { readonly tileid: number; readonly duration: number }[] =>
  animation.frames.flatMap((frame) => {
    const tile = input.tileset.tiles.find((each) => each.key === frame.key);
    return tile ? [{ tileid: tiledGridId(input, tile.x, tile.y), duration: frame.durationMs }] : [];
  });

export { tiledTileAnimation };
