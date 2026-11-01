/* @layer core @kind types */
type PatternId = 'checker' | 'bayer' | 'rows' | 'columns' | 'dots' | 'diagonal' | 'sparse';

type TilePatternId = Exclude<PatternId, 'bayer'>;

type PatternTile = { readonly width: number; readonly height: number; readonly on: readonly boolean[] };

export type { PatternId, PatternTile, TilePatternId };
