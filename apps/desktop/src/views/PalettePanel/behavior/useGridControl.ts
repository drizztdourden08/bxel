/* @layer renderer-app @kind hook */
import { columnsOf, REORDER_ITEM_SELECTOR, useMoveFocus, useReorderDrag } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent, RefObject } from 'react';
import type { GridControl, PanelModel } from '../PalettePanel.type';
import { focusSwatch } from './focus-swatch';
import { gridKeyDown } from './grid-key-down';
import { heldDrop } from './held-drop';
import { moveInGrid } from './move-in-grid';

const useGridControl = (panel: PanelModel, listRef: RefObject<HTMLElement | null>): GridControl => {
  const focus = useMoveFocus(listRef);
  const alt = useRef(false);
  const move = (from: number, to: number, swap: boolean): void => {
    const key = moveInGrid(panel, from, to, swap);
    if (key !== null) focus.expect(key);
  };
  const drag = useReorderDrag({ listRef, selector: REORDER_ITEM_SELECTOR, axis: 'grid', onDrop: (from, to) => move(from, to, alt.current) });
  const pointer = (index: number) => {
    const handlers = drag.handlers(index);
    return {
      ...handlers,
      onPointerUp: (event: PointerEvent<HTMLElement>) => {
        alt.current = event.altKey;
        if (drag.dragging !== null && heldDrop(event, index)) drag.cancel();
        else handlers.onPointerUp();
      },
    };
  };
  const keyDown = (index: number) => (event: KeyboardEvent<HTMLElement>) => {
    const total = panel.slots.length;
    gridKeyDown(event, {
      panel,
      index,
      total,
      columns: columnsOf(listRef.current, REORDER_ITEM_SELECTOR),
      move: (from, to) => move(from, to, false),
      focus: (next, extend) => {
        if (extend) panel.selection.pick(next, 'extend');
        else panel.selection.setFocus(next);
        focusSwatch(listRef.current, next);
      },
    });
  };
  return { drag, pointer: panel.lock.locked ? () => ({}) : pointer, keyDown };
};

export { useGridControl };
