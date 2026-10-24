/* @layer core @kind logic */
import { encodePngRgba } from '../encode-png-rgba';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { packSheet } from '../sheet/pack-sheet';
import { renderSheet } from '../sheet/render-sheet';
import { checkTilesetImageInput } from './check-tileset-image-input';
import type { TilesetImageInput, TilesetImageResult } from './tilemap.type';

const exportTilesetImage = (input: TilesetImageInput): TilesetImageResult => {
  const invalid = checkTilesetImageInput(input);
  if (invalid) return invalid;
  const columns = Math.min(input.columns, input.tiles.length);
  const items = input.tiles.map((tile) => ({ key: String(tile.key), width: input.tileWidth, height: input.tileHeight }));
  const packed = packSheet(items, {
    layout: {
      kind: 'grid',
      columns,
      cellWidth: input.tileWidth,
      cellHeight: input.tileHeight,
      spacingX: input.spacing,
      spacingY: input.spacing,
      order: 'rows',
    },
    margin: input.margin,
    extrude: 0,
  });
  if (!packed.ok) return packed;
  const placements = packed.items.flatMap((box, index) => {
    const tile = input.tiles[index];
    return tile ? [{ box, image: tile.image }] : [];
  });
  const image = renderSheet(packed, placements, 0);
  const png = encodePngRgba(image);
  if (!png.ok) return formatFail(FORMAT_ERROR_CODE.TILEMAP_INVALID_INPUT, png.message);
  return {
    ok: true,
    image,
    png: png.bytes,
    columns,
    rows: Math.ceil(input.tiles.length / columns),
    tileWidth: input.tileWidth,
    tileHeight: input.tileHeight,
    spacing: input.spacing,
    margin: input.margin,
    tiles: packed.items.map((box, index) => ({ key: input.tiles[index]?.key ?? 0, x: box.x, y: box.y })),
  };
};

export { exportTilesetImage };
