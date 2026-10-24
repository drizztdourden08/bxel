/* @layer renderer-app @kind logic */
import { TILE_REACH } from '../PixelViewport.constants';
import type { PixelTiling } from '../PixelViewport.type';
import type { ImageSize, PlacedImage } from './viewport.type';

const copiesOf = (start: number, length: number, room: number, on: boolean): number[] => {
  if (!on || length <= 0) return [0];
  const first = Math.max(-TILE_REACH, Math.floor(-start / length));
  const last = Math.min(TILE_REACH, Math.ceil((room - start) / length) - 1);
  const copies: number[] = [];
  for (let at = Math.min(first, 0); at <= Math.max(last, 0); at += 1) copies.push(at);
  return copies;
};

const tilePlacements = (placed: PlacedImage, tiled: PixelTiling, room: ImageSize): PlacedImage[] => {
  const rows = copiesOf(placed.y, placed.height, room.height, tiled.y);
  const columns = copiesOf(placed.x, placed.width, room.width, tiled.x);
  const copies = rows.flatMap((row) =>
    columns
      .filter((column) => row !== 0 || column !== 0)
      .map((column) => ({
        ...placed,
        x: Math.round(placed.x + column * placed.width),
        y: Math.round(placed.y + row * placed.height),
      })),
  );
  return [placed, ...copies];
};

export { tilePlacements };
