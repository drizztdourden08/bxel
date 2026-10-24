/* @layer renderer-app @kind logic */
import type { Size, Sprite } from '@bxel/document';
import type { GridCell } from './grid-edit.type';

const cellOf = (wanted: number | null | undefined, current: number | undefined): number => wanted ?? current ?? 1;

const gridEdit = (sprite: Sprite, cell: GridCell): Size | null | undefined => {
  const width = cellOf(cell.width, sprite.pixelGrid?.width);
  const height = cellOf(cell.height, sprite.pixelGrid?.height);
  const plain = width === 1 && height === 1;
  if (plain) return sprite.pixelGrid === undefined ? undefined : null;
  return sprite.pixelGrid?.width === width && sprite.pixelGrid.height === height ? undefined : { width, height };
};

export { gridEdit };
