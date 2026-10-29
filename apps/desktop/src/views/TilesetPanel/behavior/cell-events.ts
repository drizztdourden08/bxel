/* @layer renderer-app @kind logic */
import type { KeyboardEvent, PointerEvent } from 'react';
import type { GridHandlers } from '../TilesetPanel.type';

const cellEvents = (index: number, focused: number, handlers: GridHandlers) => ({
  'data-grid-index': index,
  tabIndex: focused === index ? 0 : -1,
  onPointerDown: (event: PointerEvent<HTMLElement>) => handlers.down(index, event),
  onPointerEnter: (event: PointerEvent<HTMLElement>) => handlers.enter(index, event),
  onPointerUp: handlers.up,
  onFocus: () => handlers.focus(index),
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => handlers.keyDown(index, event),
});

export { cellEvents };
