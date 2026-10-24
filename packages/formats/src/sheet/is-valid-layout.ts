/* @layer core @kind logic */
import { isCount } from './is-count';
import { isSize } from './is-size';
import type { SheetLayoutSpec } from './sheet.type';

const isValidLayout = (layout: SheetLayoutSpec): boolean => {
  if (layout.kind === 'packed') return isSize(layout.maxWidth) && isCount(layout.padding);
  const cells = isSize(layout.columns) && isSize(layout.cellWidth) && isSize(layout.cellHeight);
  return cells && isCount(layout.spacingX) && isCount(layout.spacingY);
};

export { isValidLayout };
