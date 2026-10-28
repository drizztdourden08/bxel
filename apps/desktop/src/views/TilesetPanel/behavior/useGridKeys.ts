/* @layer renderer-app @kind hook */
import type { KeyboardEvent, RefObject } from 'react';
import { MODES } from '../TilesetPanel.constants';
import type { TilesetModel } from '../TilesetPanel.type';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { pickTile } from '../../../tilemap/pick-tile';
import { focusCell } from './focus-cell';
import { gridStep } from './grid-step';

interface GridKeyInput {
  model: TilesetModel;
  anchor: RefObject<number | null>;
  setFocused: (index: number) => void;
  span: (to: number) => void;
  toggle: (index: number) => void;
}

const CLEAR = { columns: 1, rows: 1, keys: [0] } as const;

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
  return (index: number, event: KeyboardEvent<HTMLElement>): void => {
    const modeKey = MODES[Number(event.key) - 1];
    if (move(index, event)) event.preventDefault();
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) toggle(index);
      else pick(index);
    } else if (event.key === 'Escape') useTilemapStore.getState().setStamp(CLEAR);
    else if (modeKey && !event.ctrlKey && !event.altKey && !event.metaKey) useTilesetViewStore.getState().setMode(modeKey.value);
  };
};

export { useGridKeys };
