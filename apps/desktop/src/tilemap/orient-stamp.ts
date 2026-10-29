/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import { bitsOfFlags, flagsOfBits } from './flag-bits-convert';
import { stackFlags } from './stack-flags';

const sourceIndex = (flags: CellFlags, at: { column: number; row: number }, size: { width: number; height: number; columns: number }): number => {
  const x = flags.flipX ? size.width - 1 - at.column : at.column;
  const y = flags.flipY ? size.height - 1 - at.row : at.row;
  return flags.diagonal ? x * size.columns + y : y * size.columns + x;
};

const orientStamp = (stamp: TileStamp, flags: CellFlags): TileStamp => {
  if (stamp.scatter || (!flags.flipX && !flags.flipY && !flags.diagonal)) return stamp;
  const width = flags.diagonal ? stamp.rows : stamp.columns;
  const height = flags.diagonal ? stamp.columns : stamp.rows;
  const source = Array.from({ length: width * height }, (_unused, at) =>
    sourceIndex(flags, { column: at % width, row: Math.floor(at / width) }, { width, height, columns: stamp.columns }),
  );
  const { bits } = stamp;
  return {
    columns: width,
    rows: height,
    keys: source.map((from) => stamp.keys[from] ?? 0),
    ...(bits ? { bits: source.map((from) => bitsOfFlags(stackFlags(flagsOfBits(bits[from] ?? 0), flags))) } : {}),
  };
};

export { orientStamp };
