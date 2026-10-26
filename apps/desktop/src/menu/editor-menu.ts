/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { editMenu } from './edit-menu';
import type { EditorMenuState } from './editor-menu.type';
import { kindMenu } from './kind-menu';
import { viewMenu } from './view-menu';

const editorMenu = (state: EditorMenuState): MenuEntry[] => {
  const kind = kindMenu(state);
  return [editMenu(state), ...(kind ? [kind] : []), viewMenu(state)];
};

export { editorMenu };
