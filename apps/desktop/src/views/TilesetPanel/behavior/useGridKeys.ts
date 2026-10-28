/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import { MODES } from '../TilesetPanel.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { pickTile } from '../../../tilemap/pick-tile';
import { focusCell } from './focus-cell';
import { gridStep } from './grid-step';
import type { GridKeyInput } from './useGridKeys.type';
import { CLEAR_STAMP } from './useGridKeys.constants';

const useGridKeys = ({ model, anchor, setFocused, span, toggle }: GridKeyInput) => {
  const count = model.slots.length;
  const pick = (index: number): void => {
    anchor.current = index;
    const key = model.slots[index]?.tile.key;
    if (key !== undefined) pickTile(key);
  };
  const move = (index: number, event: KeyboardEvent<HTMLElement>): boolean => {
    const next = gridStep(event.key, index, model.layout.columns, count);
    if (next === null) return false;
    setFocused(next);
    focusCell(event.currentTarget, next);
    if (event.shiftKey) {
      anchor.current ??= index;
      span(next);
    }
    return true;
  };
  const activate = (index: number, event: KeyboardEvent<HTMLElement>): void => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) toggle(index);
    else pick(index);
  };
  return (index: number, event: KeyboardEvent<HTMLElement>): void => {
    if (move(index, event)) event.preventDefault();
    else if (event.key === 'Enter' || event.key === ' ') activate(index, event);
    else if (event.key === 'Escape') useTilemapStore.getState().setStamp(CLEAR_STAMP);
    else if (!event.ctrlKey && !event.altKey && !event.metaKey) {
      const mode = MODES[Number(event.key) - 1];
      if (mode) useTilesetViewStore.getState().setMode(mode.value);
    }
  };
};

export { useGridKeys };
