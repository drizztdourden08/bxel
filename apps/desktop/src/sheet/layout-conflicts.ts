/* @layer renderer-app @kind logic */
import { findOverlaps, sheetSizes } from '@bxel/document';
import type { Artwork, Size, SpriteId } from '@bxel/document';
import { homeSheet } from './home-sheet';

const layoutConflicts = (artwork: Artwork, activeId: SpriteId, resized: ReadonlyMap<SpriteId, Size>): number => {
  const sheet = homeSheet(artwork, activeId);
  if (!sheet || resized.size === 0) return 0;
  const sizes = sheetSizes(artwork);
  const before = findOverlaps(sheet, sizes).length;
  const after = findOverlaps(sheet, new Map([...sizes, ...resized])).length;
  return Math.max(0, after - before);
};

export { layoutConflicts };
