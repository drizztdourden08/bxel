/* @layer renderer-app @kind component */
import { Svg, SvgRect } from '@drizztdourden08/tessera';
import type { TiledGlyphProps } from '../ViewPanel.type';
import { GLYPH_CELLS as CELLS, GLYPH_GAP as GAP, GLYPH_SIZE as SIZE } from './TiledGlyph.constants';

const repeats = (mode: string, column: number, row: number): boolean => {
  if (column === 1 && row === 1) return true;
  if (mode === 'x') return row === 1;
  if (mode === 'y') return column === 1;
  return mode === 'both';
};

const TiledGlyph = ({ mode }: TiledGlyphProps) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" aria-hidden="true" className="view-panel__glyph">
    {CELLS.flatMap((row) =>
      CELLS.map((column) => (
        <SvgRect
          key={`${column}-${row}`}
          x={column * (SIZE + GAP) + 1}
          y={row * (SIZE + GAP) + 1}
          width={SIZE}
          height={SIZE}
          className={column === 1 && row === 1 ? 'view-panel__glyph-main' : 'view-panel__glyph-copy'}
          opacity={repeats(mode, column, row) ? 1 : 0.18}
        />
      )),
    )}
  </Svg>
);

export { TiledGlyph };
