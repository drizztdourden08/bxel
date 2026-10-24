/* @layer renderer-app @kind logic */
import { GRID_GAP, GRID_ROW_ATTRIBUTE } from '../../../sheet-manager/virtual-grid.constants';
import type { GridMetrics } from '../../../sheet-manager/virtual-grid.type';
import { MARQUEE_ITEM } from '../SpritesPanel.constants';

const zoomOf = (root: HTMLElement): number => {
  const zoom = (root as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom;
  return typeof zoom === 'number' && zoom > 0 ? zoom : 1;
};

const gapBetween = (first: HTMLElement, second: HTMLElement | undefined, zoom: number): number => {
  if (second?.offsetTop !== first.offsetTop) return GRID_GAP;
  return (second.getBoundingClientRect().left - first.getBoundingClientRect().right) / zoom;
};

const measureGrid = (root: HTMLElement, rowHeight: number): GridMetrics | null => {
  const [first, second] = Array.from(root.querySelectorAll<HTMLElement>(MARQUEE_ITEM));
  if (!first || rowHeight <= 0) return null;
  const zoom = zoomOf(root);
  const rootBox = root.getBoundingClientRect();
  const box = first.getBoundingClientRect();
  const rowBox = first.closest<HTMLElement>(`[${GRID_ROW_ATTRIBUTE}]`)?.getBoundingClientRect();
  return {
    rowHeight,
    left: (box.left - rootBox.left) / zoom + root.scrollLeft - root.clientLeft,
    inset: rowBox ? (box.top - rowBox.top) / zoom : 0,
    tileWidth: box.width / zoom,
    tileHeight: box.height / zoom,
    gap: gapBetween(first, second, zoom),
  };
};

export { measureGrid };
