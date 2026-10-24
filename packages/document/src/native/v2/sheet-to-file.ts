/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import { requireLinks } from './link-needs';
import type { SheetFileJson } from './sheet-file.type';
import { sheetNeeds } from './sheet-needs';

const sheetToFile = (slice: AssetSlice): SheetFileJson => {
  const { sheets = [], presets = [] } = slice.artwork;
  const [sheet] = sheets;
  if (sheets.length !== 1 || !sheet) throw new Error('A sheet file holds exactly one sheet.');
  const file = { sheet, presets };
  requireLinks(sheetNeeds(file), slice.links, 'A sheet file');
  return file;
};

export { sheetToFile };
