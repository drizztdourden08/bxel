/* @layer renderer-app @kind logic */
import { reorderStep } from '@drizztdourden08/tessera';
import type { KeyboardEvent } from 'react';
import { copySwatchHex } from '../../../editor/copy-swatch-hex';
import { setHeldColour } from '../../../editor/set-held-colour';
import { startChange } from '../../../palette-change/start-change';
import { DIGIT_SLOTS } from '../PalettePanel.constants';
import type { GridKeyAction, GridKeyContext } from '../PalettePanel.type';
import { focusStep } from './focus-step';

const withCtrl: Readonly<Record<string, GridKeyAction>> = {
  a: ({ panel }) => panel.selection.all(),
  c: ({ index }) => void copySwatchHex({ index }),
};

const plain: Readonly<Record<string, GridKeyAction>> = {
  F2: ({ panel, index }, event) => panel.editor.open(index, event.currentTarget),
  Delete: ({ index }) => startChange('delete', index),
  Escape: ({ panel }) => panel.selection.clear(),
  ' ': ({ panel, index }) => panel.selection.pick(index, 'toggle'),
};

const commandKey = (event: KeyboardEvent<HTMLElement>, context: GridKeyContext): boolean => {
  const ctrl = event.ctrlKey || event.metaKey;
  const action = ctrl ? withCtrl[event.key.toLowerCase()] : plain[event.key];
  if (!action) return false;
  action(context, event);
  return true;
};

const heldKey = (event: KeyboardEvent<HTMLElement>, index: number): boolean => {
  const position = event.ctrlKey || event.altKey || event.metaKey ? undefined : DIGIT_SLOTS[event.key];
  if (position === undefined) return false;
  setHeldColour(position + 1, index);
  return true;
};

const moveKey = (event: KeyboardEvent<HTMLElement>, context: GridKeyContext): boolean => {
  const { index, total, columns } = context;
  if (event.altKey) {
    const to = reorderStep(event, { axis: 'grid', chord: 'alt', index, total, columns });
    if (to === undefined) return false;
    context.move(index, to);
    return true;
  }
  const next = focusStep(event.key, index, total, columns);
  if (next === undefined) return false;
  context.focus(next, event.shiftKey);
  return true;
};

const gridKeyDown = (event: KeyboardEvent<HTMLElement>, context: GridKeyContext): void => {
  if (moveKey(event, context) || heldKey(event, context.index) || commandKey(event, context)) {
    event.preventDefault();
    event.stopPropagation();
  }
};

export { gridKeyDown };
