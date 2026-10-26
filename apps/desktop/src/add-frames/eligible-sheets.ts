/* @layer renderer-app @kind logic */
import type { Animation, Artwork, Sheet } from '@bxel/document';
import { eligibleSprites } from './eligible-sprites';
import { sheetSprites } from './sheet-sprites';

const eligibleSheets = (artwork: Artwork, animation: Animation): readonly Sheet[] => {
  const { sprites } = eligibleSprites(artwork, animation);
  return artwork.sheets.filter((sheet) => sheetSprites(sheet, sprites).length > 0);
};

export { eligibleSheets };
