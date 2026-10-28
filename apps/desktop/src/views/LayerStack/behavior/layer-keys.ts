/* @layer renderer-app @kind logic */
import type { KeyboardEvent, RefObject } from 'react';
import { REORDER_ITEM_SELECTOR, reorderStep } from '@drizztdourden08/tessera';
import { LAYER_FOCUS_KEYS } from '../LayerStack.constants';
import { mainButton } from './main-button';

interface LayerKeysInput {
  total: number;
  movable: boolean;
  move: (from: number, to: number) => void;
  extend: (to: number) => void;
}

const rowOf = (target: EventTarget): HTMLElement | null =>
  target instanceof HTMLElement ? target.closest<HTMLElement>('[data-reorder-index]') : null;

const plainKeys = (event: KeyboardEvent<HTMLElement>): boolean => !event.altKey && !event.ctrlKey && !event.metaKey;

const focusIndex = (event: KeyboardEvent<HTMLElement>, index: number, total: number): number | undefined => {
  const end = LAYER_FOCUS_KEYS[event.key];
  if (end !== undefined && plainKeys(event)) return end === 'first' ? 0 : total - 1;
  return reorderStep(event, { axis: 'vertical', chord: 'plain', index, total });
};

const focusRow = (listRef: RefObject<HTMLElement | null>, index: number): void => {
  mainButton(listRef.current?.querySelectorAll<HTMLElement>(REORDER_ITEM_SELECTOR)[index])?.focus();
};

/** The keys of the layer list: arrows and Home and End move the focus, Shift extends the pick, Alt moves the row. */
const layerKeys = (listRef: RefObject<HTMLElement | null>, { total, movable, move, extend }: LayerKeysInput) =>
  (event: KeyboardEvent<HTMLElement>): void => {
    const row = rowOf(event.target);
    if (!row) return;
    const index = Number(row.dataset.reorderIndex);
    const to = reorderStep(event, { axis: 'vertical', chord: 'alt', index, total });
    if (to !== undefined) {
      event.preventDefault();
      if (movable) move(index, to);
      return;
    }
    if (event.target !== mainButton(row)) return;
    const next = focusIndex(event, index, total);
    if (next === undefined) return;
    event.preventDefault();
    if (event.shiftKey) extend(next);
    focusRow(listRef, next);
  };

export { layerKeys };
