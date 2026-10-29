/* @layer renderer-app @kind logic */
import type { TilesetId } from '@bxel/document';
import type { CellClip } from '../stores/tilemap-store.type';
import { CELL_CLIP_VERSION, MAX_CLIP_CELLS } from './cell-clip.constants';

const isWhole = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value);

const isList = (value: unknown, length: number, max: number): value is number[] =>
  Array.isArray(value) && value.length === length && value.every((each) => isWhole(each) && each >= 0 && each <= max);

const parsed = (bytes: Uint8Array): Record<string, unknown> | null => {
  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const sizeOf = (found: Record<string, unknown>): { columns: number; rows: number } | null => {
  const { columns, rows } = found;
  const sane = isWhole(columns) && isWhole(rows) && columns >= 1 && rows >= 1 && columns * rows <= MAX_CLIP_CELLS;
  return sane ? { columns, rows } : null;
};

const headOf = (found: Record<string, unknown>) => {
  const size = sizeOf(found);
  const { x, y, tileset } = found;
  const sane = size !== null && found.v === CELL_CLIP_VERSION && typeof tileset === 'string' && isWhole(x) && isWhole(y);
  return sane ? { ...size, x, y, tileset } : null;
};

const decodeCellClip = (bytes: Uint8Array): CellClip | null => {
  const found = parsed(bytes);
  const head = found ? headOf(found) : null;
  if (!found || !head) return null;
  const cells = head.columns * head.rows;
  const { keys, bits } = found;
  if (!isList(keys, cells, 0x0fffffff) || (bits !== undefined && !isList(bits, cells, 7))) return null;
  const stamp = { columns: head.columns, rows: head.rows, keys, ...(bits === undefined ? {} : { bits }) };
  return { tilesetId: head.tileset as TilesetId, origin: { x: head.x, y: head.y }, stamp };
};

export { decodeCellClip };
