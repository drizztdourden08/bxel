/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { editMenu } from './edit-menu';
import type { EditorMenuState } from './editor-menu.type';
import { helpMenu } from './help-menu';
import { layerMenu } from './layer-menu';
import { sheetMenu } from './sheet-menu';
import { paletteMenu } from './palette-menu';
import { viewMenu } from './view-menu';

const editorMenu = (state: EditorMenuState): MenuEntry[] => [
  editMenu(state),
  paletteMenu(state),
  layerMenu(state),
  sheetMenu(state),
  viewMenu(state),
  helpMenu(),
];

export { editorMenu };
