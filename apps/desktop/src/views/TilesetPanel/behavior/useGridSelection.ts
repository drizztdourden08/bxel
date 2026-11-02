/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { GridSelection, TilePaint, TilesetModel } from '../TilesetPanel.type';
import { gridPress } from './grid-press';
import { gridRelease } from './grid-release';
import type { PressKeys } from './grid-press.type';
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
  const press = (index: number, event: PressKeys): void => gridPress(index, event, { model, paint, anchor, held, moving, keyOf, span, toggle });
  const release = (): void => gridRelease({ paint, pressed, held, moving, hover, dragged, keyOf });
  const keys = useGridKeys({ model, anchor, span, toggle });
  return {
    handlers: {
      down: (index, event) => {
        if (event.button !== 0) return;
        pressed.current = true;
        dragged.current = false;
        held.current = null;
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
      keyDown: keys,
    },
  };
};

export { useGridSelection };
