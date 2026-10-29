/* @layer renderer-app @kind logic */
import { findPartOverlaps, sheetSizes } from '@bxel/document';
import type { Artwork, Sheet } from '@bxel/document';

const overlapCount = (artwork: Artwork, sheet: Sheet | null): number =>
  sheet === null ? 0 : findPartOverlaps(sheet, sheetSizes(artwork), artwork.animations).length;

export { overlapCount };
