/* @layer renderer-app @kind component */
import { Box, VirtualGrid } from '@drizztdourden08/tessera';
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { WheelEvent } from 'react';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { cellSize } from '../behavior/cell-size';
import { slotKey } from '../behavior/slot-key';
import { wheelZoom } from '../behavior/wheel-zoom';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileCell, TileGridProps } from '../TilesetPanel.type';
import { TileSlot } from './TileSlot';

const isHole = (slot: TileCell | null): boolean => slot === null;

const TileGrid = ({ model, view, handlers }: TileGridProps) => {
  const size = cellSize(view.tileset, view.zoom);
  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (event.ctrlKey) useTilesetViewStore.getState().setZoom(wheelZoom(view.zoom, event.deltaY));
  };
  return (
    <Box className="tileset-panel__grid" onPointerLeave={handlers.leave} onWheel={onWheel}>
      <VirtualGrid
        label={TILESET_TEXT.grid}
        items={model.slots}
        getKey={slotKey}
        columns={model.layout.columns}
        tileWidth={size.width}
        tileHeight={size.height}
        holes={isHole}
        renderTile={(cell: TileCell | null, index: number, bind: VirtualGridCellBind) => <TileSlot cell={cell} index={index} bind={bind} view={view} handlers={handlers} />}
      />
    </Box>
  );
};

export { TileGrid };
