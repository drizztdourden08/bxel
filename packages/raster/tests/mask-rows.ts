/* @layer tests @kind logic */
import type { MaskView } from '@bxel/raster';

const maskRows = (mask: MaskView): string[] => {
  const rows: string[] = [];
  for (let y = 0; y < mask.height; y++) {
    const row = mask.bits.subarray(y * mask.width, (y + 1) * mask.width);
    rows.push(Array.from(row, (bit) => (bit === 0 ? '.' : '#')).join(''));
  }
  return rows;
};

export { maskRows };
