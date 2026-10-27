/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Point } from '../model/geometry.type';
import type { Sheet } from '../model/sheet.type';
import { gridAnimationPoints } from './grid-animation-points';
import { gridPoints } from './grid-points';
import { packedPoints } from './packed-points';
import { stripBoxes } from './strip-boxes';
import type { SheetSizes } from './sheet-overlap.type';
import { EMPTY_SIZE } from './sheet.constants';

const movedTo = (at: readonly Point[], points: readonly Point[]): boolean => at.some((point, index) => {
  const next = points[index];
  return next !== undefined && (next.x !== point.x || next.y !== point.y);
});

const arrangeSheet = (sheet: Sheet, sizes: SheetSizes, animations: readonly Animation[]): Sheet => {
  const { layout, entries, spacing, margin } = sheet;
  if (layout.kind === 'manual') return sheet;
  const strips = sheet.animationEntries ?? [];
  const boxes = entries.map((entry) => sizes.get(entry.spriteId) ?? EMPTY_SIZE);
  const sizesOfStrips = stripBoxes(sheet, animations);
  const points =
    layout.kind === 'grid'
      ? gridPoints(layout, entries.length, spacing, margin)
      : packedPoints([...boxes, ...sizesOfStrips], layout.maxWidth, spacing, margin, entries.length);
  const spots =
    layout.kind === 'grid'
      ? gridAnimationPoints(layout, entries.length, sizesOfStrips, spacing, margin)
      : points.slice(entries.length);
  const spriteSpots = points.slice(0, entries.length);
  const moved = movedTo(entries.map((entry) => entry.at), spriteSpots) || movedTo(strips.map((entry) => entry.at), spots);
  if (!moved) return sheet;
  const placed = { ...sheet, entries: entries.map((entry, index) => ({ ...entry, at: spriteSpots[index] ?? entry.at })) };
  return strips.length === 0 ? placed : { ...placed, animationEntries: strips.map((entry, index) => ({ ...entry, at: spots[index] ?? entry.at })) };
};

export { arrangeSheet };
