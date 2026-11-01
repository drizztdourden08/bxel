/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { pickTile } from '../../../tilemap/pick-tile';
import { setLayout } from '../../../tilemap/set-layout';
import type { GridSelection, TilePaint, TilesetModel } from '../TilesetPanel.type';
import { layoutStamp } from './layout-stamp';
import { toggleScatter } from './toggle-scatter';
import { useGridKeys } from './useGridKeys';

const useGridSelection = (model: TilesetModel, paint: TilePaint): GridSelection => {
  const anchor = useRef<number | null>(null);
  const pressed = useRef(false);
  const hover = useRef<number | null>(null);
  const moving = useRef<number | null>(null);
  const held = useRef<number | null>(null);
  const dragged = useRef(false);
  const [focused, setFocused] = useState(0);
  const keyOf = (index: number): number | null => model.slots[index]?.tile.key ?? null;
  const span = (to: number): void => {
    const from = anchor.current ?? to;
    if (model.editMode === 'edit') return;
    useTilemapStore.getState().setStamp(layoutStamp(model.layout, from, to));
  };
  const toggle = (index: number): void => {
    const key = keyOf(index);
    anchor.current = index;
    if (key !== null) useTilemapStore.getState().setStamp(toggleScatter(model.stamp, key));
  };
  const press = (index: number, event: { altKey: boolean; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }): void => {
    const slot = model.slots[index];
    if (paint.active) paint.add(keyOf(index));
    else if (event.altKey && keyOf(index) !== null) moving.current = keyOf(index);
    else if (slot?.picked && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      anchor.current = index;
      held.current = index;
    } else if (event.ctrlKey || event.metaKey) toggle(index);
    else if (event.shiftKey && anchor.current !== null) span(index);
    else {
      anchor.current = index;
      const key = keyOf(index);
      if (key !== null) pickTile(key);
    }
  };
  const release = (): void => {
    pressed.current = false;
    if (paint.active) paint.commit();
    const kept = held.current;
    held.current = null;
    const keptKey = kept === null ? null : keyOf(kept);
    if (kept !== null && !dragged.current && keptKey !== null) pickTile(keptKey);
    const from = moving.current;
    moving.current = null;
    if (from !== null && hover.current !== null) setLayout({ move: [{ key: from, to: hover.current }] });
  };
  const keys = useGridKeys({ model, anchor, setFocused, span, toggle });
  return {
    focused,
    handlers: {
      down: (index, event) => {
        if (event.button !== 0) return;
        pressed.current = true;
        dragged.current = false;
        held.current = null;
        setFocused(index);
        press(index, event);
      },
      enter: (index, event) => {
        hover.current = index;
        useTilesetViewStore.getState().setHoverKey(keyOf(index));
        if (!pressed.current || event.buttons !== 1) return;
        if (paint.active) paint.add(keyOf(index));
        else if (held.current === null && moving.current === null && !event.ctrlKey && !event.metaKey) span(index);
      },
      up: release,
      leave: () => {
        useTilesetViewStore.getState().setHoverKey(null);
        release();
      },
      dragStart: () => {
        dragged.current = true;
      },
      dragEnd: () => {
        dragged.current = false;
        held.current = null;
      },
      focus: setFocused,
      keyDown: keys,
    },
  };
};

export { useGridSelection };
