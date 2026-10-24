/* @layer renderer-app @kind logic */
import type { MarqueeItem } from '@drizztdourden08/tessera';
import type { GridRow } from './folders.type';
import type { GridMetrics } from './virtual-grid.type';

const gridTileRects = (rows: readonly GridRow[], metrics: GridMetrics): MarqueeItem[] =>
  rows.flatMap((row, at) =>
    row.facts.map((fact, column) => ({
      key: fact.sprite.id,
      rect: {
        x: metrics.left + column * (metrics.tileWidth + metrics.gap),
        y: at * metrics.rowHeight + metrics.inset,
        width: metrics.tileWidth,
        height: metrics.tileHeight,
      },
    })),
  );

export { gridTileRects };
