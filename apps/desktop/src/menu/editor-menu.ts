/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { editMenu } from './edit-menu';
import type { EditorMenuState } from './editor-menu.type';
import { kindMenu } from './kind-menu';
import { viewMenu } from './view-menu';

const editorMenu = (state: EditorMenuState): MenuEntry[] => {
  const kind = kindMenu(state);
  const view = viewMenu(state);
  return [editMenu(state), ...(kind ? [kind] : []), ...(view.children && view.children.length > 0 ? [view] : [])];
};

export { editorMenu };
