/* @layer renderer-app @kind logic */
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { GridHandlers } from '../TilesetPanel.type';

const cellEvents = (index: number, bind: VirtualGridCellBind, handlers: GridHandlers) => ({
  ...bind,
  className: `${bind.className} tileset-panel__cell`,
  'data-grid-index': index,
  onPointerDown: (event: PointerEvent<HTMLElement>) => handlers.down(index, event),
  onPointerEnter: (event: PointerEvent<HTMLElement>) => handlers.enter(index, event),
  onPointerUp: handlers.up,
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
    handlers.keyDown(index, event);
    bind.onKeyDown(event);
  },
});

export { cellEvents };
