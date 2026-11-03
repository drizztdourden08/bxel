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
  const pasteKids = [
    item(ID.pasteAsLayer, 'As new layer'),
    item(ID.pasteIntoSelection, 'Into selection'),
    item(ID.pasteExpand, 'Expand the canvas to fit'),
    item(ID.pasteTransform, 'Paste and transform'),
    item(ID.pasteNewSprite, 'As new sprite'),
    item(ID.pasteAsFrame, 'As new frame'),
    item(ID.pasteAsTile, 'As new tile'),
    item(ID.pasteChoose, 'With a choice...'),
  ];
  const pasteSpecial: MenuItem = {
    key: 'edit-paste-special',
    label: 'Paste special',
    disabled: pasteKids.every((kid) => kid?.disabled === true),
    children: tidyMenu(pasteKids),
  };
  const fill: MenuItem = {
    key: 'edit-fill',
    label: 'Fill selection',
    children: tidyMenu([item(ID.fillFront, 'With the front colour'), item(ID.fillBack, 'With the back colour')]),
  };
  const stroke: MenuItem = {
    key: 'edit-stroke',
    label: 'Stroke selection',
    icon: 'pixel-select-stroke',
    children: tidyMenu([item(ID.strokeInside, 'Inside the edge'), item(ID.strokeOutside, 'Outside the edge')]),
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
      fill,
      stroke,
      transform,
    ]),
  };
};

export { editMenu };
