/* @layer renderer-app @kind logic */
import { BAR_GAP, BAR_MARGIN } from '../ApplyBar.constants';
import type { BarPlacement, BarRect, BarSize } from '../ApplyBar.type';

const inside = (value: number, low: number, high: number): number => Math.min(Math.max(value, low), Math.max(low, high));

const overlaps = (a: BarRect, b: BarRect): boolean => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;

const placeBar = (anchor: BarRect | null, bounds: BarRect, size: BarSize): BarPlacement => {
  const left = inside((bounds.left + bounds.right - size.width) / 2, bounds.left + BAR_MARGIN, bounds.right - size.width - BAR_MARGIN);
  if (!anchor || !overlaps(anchor, bounds)) return { x: left - bounds.left, y: BAR_MARGIN, docked: true };
  const x = inside((anchor.left + anchor.right - size.width) / 2, bounds.left + BAR_MARGIN, bounds.right - size.width - BAR_MARGIN);
  const below = anchor.bottom + BAR_GAP;
  const above = anchor.top - BAR_GAP - size.height;
  const fitsBelow = below + size.height <= bounds.bottom - BAR_MARGIN;
  const y = fitsBelow ? below : inside(above, bounds.top + BAR_MARGIN, bounds.bottom - size.height - BAR_MARGIN);
  return { x: x - bounds.left, y: y - bounds.top, docked: false };
};

export { placeBar };
