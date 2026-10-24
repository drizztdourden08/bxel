/* @layer core @kind logic */
import { CELL_BITS, TILEMAP_JSON } from './tilemap.constants';

const cellFlagBits = (cell: number): number => {
  const { flipX, flipY, diagonal } = TILEMAP_JSON.FLAG_BITS;
  return (
    ((cell & CELL_BITS.FLIP_X) === 0 ? 0 : flipX) |
    ((cell & CELL_BITS.FLIP_Y) === 0 ? 0 : flipY) |
    ((cell & CELL_BITS.DIAGONAL) === 0 ? 0 : diagonal)
  );
};

export { cellFlagBits };
