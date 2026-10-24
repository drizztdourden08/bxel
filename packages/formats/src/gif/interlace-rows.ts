/* @layer core @kind logic */
import { GIF_INTERLACE_PASSES } from './gif-interlace.constants';

const interlaceRows = (height: number): number[] => {
  const rows: number[] = [];
  for (const pass of GIF_INTERLACE_PASSES) {
    for (let y = pass.start; y < height; y += pass.step) rows.push(y);
  }
  return rows;
};

export { interlaceRows };
