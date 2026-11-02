/* @layer renderer-app @kind component */
import { Box, Canvas } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useTileSlotDrop } from '../../../tile-drag/useTileSlotDrop';
import { useTileSource } from '../../../tile-drag/useTileSource';
import { cellData } from '../behavior/cell-data';
import { cellEvents } from '../behavior/cell-events';
import { tileLabel } from '../behavior/tile-label';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileCellProps } from '../TilesetPanel.type';
import { TileBadges } from './TileBadges';
import { TileMarks } from './TileMarks';
import { TileThumb } from './TileThumb';

const TileSlot = ({ cell, index, bind, view, handlers }: TileCellProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useTileSource(ref, { key: cell?.tile.key ?? null, index, picked: cell?.picked ?? false, onStart: handlers.dragStart, onEnd: handlers.dragEnd });
  useTileSlotDrop(ref, index);
  const events = cellEvents(index, bind, handlers);
  if (!cell) {
    return (
      <Box ref={ref} role="gridcell" aria-label={TILESET_TEXT.emptySlot(index + 1)} {...events} className={`${events.className} tileset-panel__cell--hole`}>
        <Canvas width={view.tileset.tileWidth * view.zoom} height={view.tileset.tileHeight * view.zoom} className="tileset-panel__hole" aria-hidden="true" />
      </Box>
    );
  }
  const label = tileLabel(cell, cell.sprite.name);
  const painting = view.painted.has(cell.tile.key);
  return (
    <Box
      ref={ref}
      role="gridcell"
      aria-selected={cell.picked}
      aria-label={label}
      title={cell.editing ? TILESET_TEXT.editing : label}
      {...cellData(cell, painting)}
      {...events}
    >
      <TileThumb view={view} cell={cell} />
      <TileBadges view={view} cell={cell} />
      {view.mode === 'terrain' && view.terrain ? <TileMarks view={view} cell={cell} /> : null}
    </Box>
  );
};

export { TileSlot };
