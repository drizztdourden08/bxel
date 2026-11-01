/* @layer renderer-app @kind logic */
import type { KeyboardEvent, RefObject } from 'react';
import { REORDER_ITEM_SELECTOR, reorderStep } from '@drizztdourden08/tessera';
import { LAYER_FOCUS_KEYS } from '../LayerStack.constants';
import type { IndentDirection, LayerKeysInput } from './layer-keys.type';
import { mainButton } from './main-button';

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

const indentOf = (event: KeyboardEvent<HTMLElement>): IndentDirection | null => {
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return null;
  if (event.key === 'ArrowLeft') return 'out';
  return event.key === 'ArrowRight' ? 'in' : null;
};

const foldKey = (event: KeyboardEvent<HTMLElement>, index: number, input: LayerKeysInput): number | null | undefined => {
  if (!plainKeys(event) || event.shiftKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return undefined;
  const row = input.rows[index];
  if (!row) return undefined;
  const open = row.kind === 'group' && !input.folded.includes(row.id);
  if (event.key === 'ArrowLeft') {
    if (open) {
      input.setFolded(row.id, true);
      return null;
    }
    const parent = input.rows.findIndex((each) => each.id === row.parentId);
    return parent < 0 ? undefined : parent;
  }
  if (row.kind !== 'group') return undefined;
  if (!open) {
    input.setFolded(row.id, false);
    return null;
  }
  return input.rows[index + 1]?.parentId === row.id ? index + 1 : undefined;
};

const layerKeys = (listRef: RefObject<HTMLElement | null>, input: LayerKeysInput) =>
  (event: KeyboardEvent<HTMLElement>): void => {
    const row = rowOf(event.target);
    if (!row) return;
    const { rows, movable, move, extend } = input;
    const total = rows.length;
    const index = Number(row.dataset.reorderIndex);
    const indent = indentOf(event);
    if (indent !== null) {
      event.preventDefault();
      const id = rows[index]?.id;
      if (movable && id !== undefined) input.indent(id, indent);
      return;
    }
    const to = reorderStep(event, { axis: 'vertical', chord: 'alt', index, total });
    if (to !== undefined) {
      event.preventDefault();
      if (movable) move(index, to);
      return;
    }
    if (event.target !== mainButton(row)) return;
    const folding = foldKey(event, index, input);
    if (folding !== undefined) {
      event.preventDefault();
      if (folding !== null) focusRow(listRef, folding);
      return;
    }
    const next = focusIndex(event, index, total);
    if (next === undefined) return;
    event.preventDefault();
    if (event.shiftKey) extend(next);
    focusRow(listRef, next);
  };

export { layerKeys };
