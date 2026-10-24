/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import type { PackedItem } from './sheet.type';

const occupiedBox = (item: PackedItem): Box => ({
  x: item.x,
  y: item.y,
  width: item.rotated ? item.height : item.width,
  height: item.rotated ? item.width : item.height,
});

export { occupiedBox };
