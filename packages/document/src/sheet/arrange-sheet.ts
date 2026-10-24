/* @layer core @kind logic */
import type { Sheet } from '../model/sheet.type';
import { gridPoints } from './grid-points';
import { packedPoints } from './packed-points';
import type { SheetSizes } from './sheet-overlap.type';
import { EMPTY_SIZE } from './sheet.constants';

const arrangeSheet = (sheet: Sheet, sizes: SheetSizes): Sheet => {
  const { layout, entries, spacing, margin } = sheet;
  if (layout.kind === 'manual') return sheet;
  const boxes = entries.map((entry) => sizes.get(entry.spriteId) ?? EMPTY_SIZE);
  const points =
    layout.kind === 'grid'
      ? gridPoints(layout, entries.length, spacing, margin)
      : packedPoints(boxes, layout.maxWidth, spacing, margin);
  const moved = entries.some((entry, index) => {
    const point = points[index];
    return point !== undefined && (point.x !== entry.at.x || point.y !== entry.at.y);
  });
  if (!moved) return sheet;
  return { ...sheet, entries: entries.map((entry, index) => ({ ...entry, at: points[index] ?? entry.at })) };
};

export { arrangeSheet };
