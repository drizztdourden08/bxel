/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { SELECTION_COMMAND_ID as ID } from '../keymap/selection-command-id.constants';
import { evaluate } from '../ui-context/evaluate';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';
import { transformMenu } from './transform-menu';

const editMenu = (state: EditorMenuState): MenuItem => {
  const { context } = state;
  const item = (id: string, label: string) => ruledItem(context, id, label);
  const pasteSpecial: MenuItem = {
    key: 'edit-paste-special',
    label: 'Paste special',
    children: tidyMenu([
      item(ID.pasteAsLayer, 'As new layer'),
      item(ID.pasteIntoSelection, 'Into selection'),
      item(ID.pasteExpand, 'Expand the canvas to fit'),
      item(ID.pasteTransform, 'Paste and transform'),
    ]),
  };
  const transform = evaluate('menu.edit.transform', context).state === 'hidden' ? null : transformMenu(state);
  return {
    key: MENU_KEYS.edit,
    label: MENU_TEXT.edit,
    icon: 'pencil',
    children: tidyMenu([
      item(COMMAND_ID.undo, 'Undo'),
      item(COMMAND_ID.redo, 'Redo'),
      'separator',
      item(ID.cut, 'Cut'),
      item(ID.copy, 'Copy'),
      item(ID.copyMerged, 'Copy merged'),
      item(ID.paste, 'Paste'),
      item(ID.pasteInPlace, 'Paste in place'),
      pasteSpecial,
      item(ID.delete, 'Delete'),
      'separator',
      item(ID.selectAll, 'Select all'),
      item(ID.clear, 'Deselect'),
      item(ID.reselect, 'Reselect'),
      item(ID.invert, 'Invert selection'),
      item(ID.expand, 'Expand selection'),
      item(ID.shrink, 'Shrink selection'),
      item(ID.border, 'Border selection'),
      item(ID.smooth, 'Smooth selection'),
      item(ID.selectOpaque, 'Select opaque pixels'),
      item(ID.strokeInside, 'Stroke selection inside'),
      item(ID.strokeOutside, 'Stroke selection outside'),
      item(ID.fillFront, 'Fill with the front colour'),
      item(ID.fillBack, 'Fill with the back colour'),
      item(ID.save, 'Saved selections...'),
      'separator',
      transform,
    ]),
  };
};

export { editMenu };
