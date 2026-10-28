/* @layer renderer-app @kind logic */
import { EXTRA_TEXT } from './status-extras.constants';
import type { PixelRead } from './read-extras.type';
import type { StatusExtras } from './status-extras.type';

const tileText = (key: number | null): string => (key === null ? EXTRA_TEXT.noTile : String(key));

const mapExtras = (read: PixelRead): StatusExtras => ({
  index: null,
  selection: null,
  drag: null,
  frame: null,
  cell: read.cell ? EXTRA_TEXT.cellValue(read.cell.at.x, read.cell.at.y) : null,
  tile: read.cell ? tileText(read.cell.key) : null,
});

export { mapExtras };
