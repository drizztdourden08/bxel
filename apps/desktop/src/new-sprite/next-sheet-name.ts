/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import { NEW_SHEET_STEM } from './new-sprite.constants';

const nextSheetName = (taken: readonly string[]): string => {
  const keys = new Set(taken.map(nameKey));
  let count = 1;
  while (keys.has(nameKey(`${NEW_SHEET_STEM} ${count}`))) count += 1;
  return `${NEW_SHEET_STEM} ${count}`;
};

export { nextSheetName };
