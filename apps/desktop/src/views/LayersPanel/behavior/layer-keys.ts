/* @layer renderer-app @kind logic */
import type { KeyboardEvent, RefObject } from 'react';
import { REORDER_ITEM_SELECTOR, reorderStep } from '@drizztdourden08/tessera';
import { LAYER_FOCUS_KEYS } from '../LayersPanel.constants';
import type { LayerKeysInput } from '../LayersPanel.type';
import { mainButton } from './main-button';

const rowOf = (target: EventTarget): HTMLElement | null =>
  target instanceof HTMLElement ? target.closest<HTMLElement>('[data-reorder-index]') : null;

const focusIndex = (event: KeyboardEvent<HTMLElement>, index: number, total: number): number | undefined => {
  const end = LAYER_FOCUS_KEYS[event.key];
  if (end !== undefined && !event.altKey && !event.ctrlKey && !event.metaKey) return end === 'first' ? 0 : total - 1;
  return reorderStep(event, { axis: 'vertical', chord: 'plain', index, total });
};

const layerKeys = (listRef: RefObject<HTMLElement | null>, { total, move }: LayerKeysInput) =>
  (event: KeyboardEvent<HTMLElement>): void => {
    const row = rowOf(event.target);
    if (!row) return;
    const index = Number(row.dataset.reorderIndex);
    const to = reorderStep(event, { axis: 'vertical', chord: 'alt', index, total });
    if (to !== undefined) {
      event.preventDefault();
      move(index, to);
      return;
    }
    if (event.target !== mainButton(row)) return;
    const next = focusIndex(event, index, total);
    if (next === undefined) return;
    event.preventDefault();
    mainButton(listRef.current?.querySelectorAll<HTMLElement>(REORDER_ITEM_SELECTOR)[next])?.focus();
  };

export { layerKeys };
