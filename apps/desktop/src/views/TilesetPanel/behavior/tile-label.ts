/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { TileCell } from '../TilesetPanel.type';
import { TILE_ANIMATION_TEXT } from '../../../tile-animation/tile-animation.constants';

const SHAPE_WORDS = { full: 'full', rect: 'box', polygon: 'shape' } as const;

const tileLabel = (cell: TileCell, name: string): string => {
  const { tile, uses } = cell;
  const shapes = tileShapes(tile);
  const parts = [
    `Tile ${tile.key}`,
    ...(name !== '' && name !== `Tile ${tile.key}` ? [name] : []),
    ...(tile.type ? [tile.type] : []),
    `used ${uses} ${uses === 1 ? 'time' : 'times'}`,
    ...(tile.animation ? [TILE_ANIMATION_TEXT.badge] : []),
    ...(shapes.length > 0 ? [`collision ${shapes.map((shape) => SHAPE_WORDS[shape.kind]).join(' and ')}`] : []),
    ...(cell.terrainSlot === null ? [] : [`terrain slot ${cell.terrainSlot + 1}`]),
  ];
  return parts.join(', ');
};

export { tileLabel };
