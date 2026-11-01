/* @layer core @kind constants */
import type { PatternId, PatternTile, TilePatternId } from './pattern.type';

const tileOf = (rows: readonly string[]): PatternTile => ({
  width: rows[0]?.length ?? 1,
  height: rows.length,
  on: rows.flatMap((row) => [...row].map((cell) => cell === '#')),
});

const PATTERN_TILES: Readonly<Record<TilePatternId, PatternTile>> = {
  checker: tileOf(['#.', '.#']),
  rows: tileOf(['#', '.']),
  columns: tileOf(['#.']),
  dots: tileOf(['#.', '..']),
  diagonal: tileOf(['#..', '.#.', '..#']),
  sparse: tileOf(['#...', '....', '..#.', '....']),
};

const PATTERN_IDS = ['checker', 'bayer', 'rows', 'columns', 'dots', 'diagonal', 'sparse'] as const satisfies readonly PatternId[];

export { PATTERN_IDS, PATTERN_TILES };
