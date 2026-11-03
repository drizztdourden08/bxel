/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { copySwatchHex } from '../../../editor/copy-swatch-hex';
import { setHeldColour } from '../../../editor/set-held-colour';
import { copyHexList } from '../../../palette-export/copy-hex-list';
import { startChange } from '../../../palette-change/start-change';
import { DIGIT_SLOTS } from '../PalettePanel.constants';
import type { GridKeyAction, GridKeyContext } from '../PalettePanel.type';

const withCtrl: Readonly<Record<string, GridKeyAction>> = {
  c: ({ panel, index }) => {
    const chosen = [...panel.selection.selected].sort((a, b) => a - b);
    if (chosen.length > 1 && chosen.includes(index)) void copyHexList(panel.target, chosen);
    else void copySwatchHex({ index });
  },
};

const plain: Readonly<Record<string, GridKeyAction>> = {
  F2: ({ panel, index }, event) => panel.editor.open(index, event.currentTarget),
  Delete: ({ index }) => startChange('delete', index),
};

const heldSlot = (event: KeyboardEvent<HTMLElement>): number | undefined => (event.ctrlKey || event.altKey || event.metaKey ? undefined : DIGIT_SLOTS[event.key]);

const actionOf = (event: KeyboardEvent<HTMLElement>): GridKeyAction | undefined => (event.ctrlKey || event.metaKey ? withCtrl[event.key.toLowerCase()] : plain[event.key]);

const gridKeyDown = (event: KeyboardEvent<HTMLElement>, context: GridKeyContext): boolean => {
  const position = heldSlot(event);
  const action = actionOf(event);
  if (position === undefined && !action) return false;
  if (position !== undefined) setHeldColour(position + 1, context.index);
  else action?.(context, event);
  event.preventDefault();
  event.stopPropagation();
  return true;
};

export { gridKeyDown };
