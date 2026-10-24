/* @layer core @kind logic */
import { checkPackInput } from './check-pack-input';
import { packGrid } from './pack-grid';
import { packShelf } from './pack-shelf';
import type { PackItem, PackResult, PackSettings } from './sheet.type';

const packSheet = (items: readonly PackItem[], settings: PackSettings): PackResult => {
  const invalid = checkPackInput(items, settings);
  if (invalid) return invalid;
  const { layout, margin, extrude, powerOfTwo = false, rotate = false } = settings;
  const options = { margin, extrude, powerOfTwo, rotate };
  return layout.kind === 'grid' ? packGrid(items, layout, options) : packShelf(items, layout, options);
};

export { packSheet };
