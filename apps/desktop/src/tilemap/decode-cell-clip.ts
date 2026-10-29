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

const decodeCellClip = (bytes: Uint8Array): CellClip | null => {
  const found = parsed(bytes);
  if (!found || found.v !== CELL_CLIP_VERSION || typeof found.tileset !== 'string') return null;
  const { columns, rows, x, y, keys, bits } = found;
  if (!isWhole(columns) || !isWhole(rows) || !isWhole(x) || !isWhole(y) || columns < 1 || rows < 1 || columns * rows > MAX_CLIP_CELLS) return null;
  if (!isList(keys, columns * rows, 0x0fffffff) || (bits !== undefined && !isList(bits, columns * rows, 7))) return null;
  return { tilesetId: found.tileset as TilesetId, origin: { x, y }, stamp: { columns, rows, keys, ...(bits === undefined ? {} : { bits: bits as number[] }) } };
};

export { decodeCellClip };
