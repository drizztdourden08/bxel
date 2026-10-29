/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
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
    if (paint.active) paint.add(keyOf(index));
    else if (event.altKey && keyOf(index) !== null) moving.current = keyOf(index);
    else if (event.ctrlKey || event.metaKey) toggle(index);
    else if (event.shiftKey && anchor.current !== null) span(index);
    else {
      anchor.current = index;
      const key = keyOf(index);
      if (key !== null) pickTile(key);
    }
  };
  const keys = useGridKeys({ model, anchor, setFocused, span, toggle });
  return {
    focused,
    handlers: {
      down: (index, event) => {
        if (event.button !== 0) return;
        pressed.current = true;
        setFocused(index);
        press(index, event);
      },
      enter: (index, event) => {
        hover.current = index;
        if (!pressed.current || event.buttons !== 1) return;
        if (paint.active) paint.add(keyOf(index));
        else if (moving.current === null && !event.ctrlKey && !event.metaKey) span(index);
      },
      up: () => {
        pressed.current = false;
        if (paint.active) paint.commit();
        const from = moving.current;
        moving.current = null;
        if (from !== null && hover.current !== null) setLayout({ move: [{ key: from, to: hover.current }] });
      },
      focus: setFocused,
      keyDown: keys,
    },
  };
};

export { useGridSelection };
