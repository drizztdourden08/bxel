/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { REORDER_ITEM_SELECTOR, useMoveFocus, useReorderDrag } from '@drizztdourden08/tessera';
import { LAYER_LIST_TEXT } from '../LayersPanel.constants';
import type { LayerListProps } from '../LayersPanel.type';
import { layerKeys } from './layer-keys';
import { tabbableLayer } from './tabbable-layer';

const useLayerList = ({ items, selectedId, onMove }: LayerListProps) => {
  const listRef = useRef<HTMLElement>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focus = useMoveFocus(listRef);
  const commit = (from: number, to: number): void => {
    const item = items[from];
    if (item) focus.announce(LAYER_LIST_TEXT.moved(item.label, to + 1, items.length));
    onMove(from, to);
  };
  const drag = useReorderDrag({ listRef, selector: REORDER_ITEM_SELECTOR, onDrop: commit });
  const move = (from: number, to: number): void => {
    const item = items[from];
    if (item) focus.expect(item.id);
    commit(from, to);
  };
  const onFocus = (event: FocusEvent<HTMLElement>): void => {
    setFocusedId(event.target.closest<HTMLElement>('[data-reorder-key]')?.dataset.reorderKey ?? null);
  };
  return {
    listRef,
    drag,
    message: focus.message,
    tabId: tabbableLayer(items, focusedId, selectedId),
    onKeyDown: layerKeys(listRef, { total: items.length, move }),
    onFocus,
  };
};

export { useLayerList };
