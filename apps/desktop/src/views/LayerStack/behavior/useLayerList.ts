/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { REORDER_ITEM_SELECTOR, useMoveFocus, useReorderDrag } from '@drizztdourden08/tessera';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerStackModel } from '../LayerStack.type';
import { layerKeys } from './layer-keys';
import type { PickHow } from './pick-layer';
import { tabbableLayer } from './tabbable-layer';

interface LayerListInput {
  model: LayerStackModel;
  shown: LayerStackModel['rows'];
  movable: boolean;
  pick: (id: string, how: PickHow) => void;
}

/** Roving focus, the keys and the pointer drag of the layer list, and the announcement of a move. */
const useLayerList = ({ model, shown, movable, pick }: LayerListInput) => {
  const listRef = useRef<HTMLElement>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focus = useMoveFocus(listRef);
  const commit = (from: number, to: number): void => {
    const row = shown[from];
    if (row) focus.announce(LAYER_STACK_TEXT.moved(row.name, to + 1, shown.length));
    model.actions.move(from, to);
  };
  const drag = useReorderDrag({ listRef, selector: REORDER_ITEM_SELECTOR, onDrop: commit });
  const dragging = drag.dragging !== null;
  useEffect(() => {
    if (!dragging) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') drag.cancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dragging, drag]);
  const move = (from: number, to: number): void => {
    const row = shown[from];
    if (row) focus.expect(row.id);
    commit(from, to);
  };
  const extend = (to: number): void => {
    const row = shown[to];
    if (row) pick(row.id, 'range');
  };
  const onFocus = (event: FocusEvent<HTMLElement>): void => {
    setFocusedId(event.target.closest<HTMLElement>('[data-reorder-key]')?.dataset.reorderKey ?? null);
  };
  return {
    listRef,
    drag,
    message: focus.message,
    tabId: tabbableLayer(shown, focusedId, model.activeId),
    onKeyDown: layerKeys(listRef, { total: shown.length, movable, move, extend }),
    onFocus,
  };
};

export { useLayerList };
