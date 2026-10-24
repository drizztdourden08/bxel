/* @layer renderer-app @kind component */
import { Box, MarqueeBox, useVirtualWindow } from '@drizztdourden08/tessera';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { gridColumns } from '../../../sheet-manager/grid-columns';
import { gridRows } from '../../../sheet-manager/grid-rows';
import { rowToken } from '../../../sheet-manager/row-token';
import { gridTileRects } from '../../../sheet-manager/grid-tile-rects';
import { GRID_ROW_ATTRIBUTE } from '../../../sheet-manager/virtual-grid.constants';
import { windowParts } from '../../../sheet-manager/window-parts';
import { measureGrid } from '../behavior/measure-grid';
import { useGridWidth } from '../behavior/useGridWidth';
import { useScrollToActive } from '../behavior/useScrollToActive';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import { NO_ROWS } from '../SpritesPanel.constants';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { GridRowView } from './GridRowView';
import { GridSpacer } from './GridSpacer';
import './VirtualGrid.css';

const VirtualGrid = (props: SpriteGridProps) => {
  const { model, box } = props;
  const latest = useRef({ rows: NO_ROWS, height: 0 });
  const marquee = useSpriteMarquee(model, (area) => {
    const metrics = measureGrid(area, latest.current.height);
    return metrics ? gridTileRects(latest.current.rows, metrics) : [];
  });
  const columns = gridColumns(useGridWidth(marquee.area), box);
  const rows = useMemo(() => gridRows(model.groups, columns), [model.groups, columns]);
  const keyAt = useCallback((index: number) => rows[index]?.key, [rows]);
  const windowed = useVirtualWindow({ enabled: true, count: rows.length, keyAt, rootRef: marquee.area, indexAttribute: GRID_ROW_ATTRIBUTE });
  const rowHeight = windowed.metrics.rowHeight;
  useEffect(() => {
    latest.current = { rows, height: rowHeight };
  }, [rows, rowHeight]);
  useScrollToActive(marquee.area, rows, model.scene.active?.id ?? null, rowHeight);
  return (
    <Box
      ref={marquee.area}
      className="sprites-panel__vgrid"
      data-row={rowToken(box)}
      onScroll={windowed.onScroll}
      onPointerDown={marquee.onPointerDown}
      onClick={marquee.onClick}
    >
      <Box ref={windowed.bodyRef} role="list" aria-label="Sprites" onFocus={windowed.onFocus} onBlur={windowed.onBlur}>
        {windowParts(windowed.indices, rows.length).map((part) => {
          const row = rows[part.at];
          if (part.kind === 'space') return <GridSpacer key={`space:${part.at}`} at={part.at} rows={part.rows} />;
          return row ? <GridRowView key={row.key} view={props} row={row} at={part.at} /> : null;
        })}
      </Box>
      <MarqueeBox rect={marquee.rect} />
    </Box>
  );
};

export { VirtualGrid };
