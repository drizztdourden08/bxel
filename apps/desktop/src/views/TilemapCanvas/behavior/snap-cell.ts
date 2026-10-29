/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { guideScope } from '../../../guides/guide-scope';
import { snapToGuides } from '../../../guides/snap-to-guides';
import { useViewStore } from '../../../stores/useViewStore';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { PixelPoint, PixelViewportHandle } from '../../PixelViewport';

const wholeLines = (lines: readonly number[], size: number): number[] => lines.map((line) => line / size).filter((cell) => Number.isInteger(cell));

const snapCell = (viewport: PixelViewportHandle | null, raw: PixelPoint, corner: { cell: Point; from: Point | null }, target: MapTarget): Point => {
  const { snap, guides } = useViewStore.getState();
  const lines = snap && guides ? guideScope()?.lines() : undefined;
  if (!viewport || !lines) return corner.cell;
  const { tileWidth: w, tileHeight: h } = target.tileset;
  const zoom = viewport.view().zoom;
  const across = snapToGuides({ x: raw.x / w, y: 0 }, { x: corner.cell.x, y: 0 }, { lines: { x: wholeLines(lines.x, w), y: [] }, zoom: zoom * w, from: corner.from && { x: corner.from.x, y: 0 } });
  const down = snapToGuides({ x: 0, y: raw.y / h }, { x: 0, y: corner.cell.y }, { lines: { x: [], y: wholeLines(lines.y, h) }, zoom: zoom * h, from: corner.from && { x: 0, y: corner.from.y } });
  return { x: across.x, y: down.y };
};

export { snapCell };
