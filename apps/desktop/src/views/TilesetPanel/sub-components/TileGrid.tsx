/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { WheelEvent } from 'react';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { wheelZoom } from '../behavior/wheel-zoom';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileGridProps } from '../TilesetPanel.type';
import { TileSlot } from './TileSlot';

const TileGrid = ({ model, view, handlers }: TileGridProps) => {
  const { columns, rows } = model.layout;
  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (event.ctrlKey) useTilesetViewStore.getState().setZoom(wheelZoom(view.zoom, event.deltaY));
  };
  return (
    <Box role="grid" aria-label={TILESET_TEXT.grid} aria-multiselectable="true" className="tileset-panel__grid" onPointerLeave={handlers.leave} onWheel={onWheel}>
      {Array.from({ length: rows }, (_row, row) => (
        <Box role="row" key={row} className="tileset-panel__row">
          {Array.from({ length: columns }, (_column, column) => {
            const index = row * columns + column;
            return <TileSlot key={index} cell={model.slots[index] ?? null} index={index} view={view} handlers={handlers} />;
          })}
        </Box>
      ))}
    </Box>
  );
};

export { TileGrid };
