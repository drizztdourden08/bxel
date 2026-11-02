/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { roleFolderMenuNode } from './role-folder-menu-node';
import { ROLE_FOLDER_TEXT } from './role-folder.constants';

const roleFolderEntry = (folderPath: string, hidden: boolean): ContextMenuEntry => {
  const node = roleFolderMenuNode(folderPath);
  const children = 'children' in node ? (node.children ?? []) : [];
  return {
    label: ROLE_FOLDER_TEXT.menu,
    icon: 'folder',
    hidden,
    items: children.flatMap((child) => {
      if (!('label' in child)) return [];
      return [{ label: child.label, kind: 'check' as const, checked: child.checked === true, run: () => child.onSelect?.() }];
    }),
  };
};

export { roleFolderEntry };
