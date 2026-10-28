/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { SHEET_COMMAND as ID } from '../../../keymap/sheet-command-id.constants';
import { currentManager } from '../../../sheet-manager/current-manager';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { MARQUEE_ITEM, SPRITE_MENU } from '../SpritesPanel.constants';
import { folderEntries } from './folder-entries';
import { makeEntries } from './make-entries';
import { orderEntries } from './order-entries';
import { selectEntries } from './select-entries';
import { sheetEntries } from './sheet-entries';
import { EMPTY_ENTRIES } from './sprite-menu-entries.constants';
import { transformEntries } from './transform-entries';

/** The tile menu: eleven entries, and the clicked entry has joined the pick before it opens. */
const spriteMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const manager = currentManager();
  if (!manager || menuTarget(context, MARQUEE_ITEM) === null) return EMPTY_ENTRIES;
  const { ids, picked } = manager;
  const any = unless(ids.length > 0 || picked.length > 0, MANAGER_TEXT.none);
  const sprites = unless(ids.length > 0, MANAGER_TEXT.none);
  return [
    { command: 'sprite.open_entry', label: MANAGER_TEXT.edit, ...any },
    {
      label: MANAGER_TEXT.rename,
      items: [
        { command: ID.renameSprite, label: MANAGER_TEXT.rename, ...sprites },
        { command: 'sprite.rename_many', label: SPRITE_MENU.renameMany, ...unless(ids.length > 1, SPRITE_MENU.needTwo) },
      ],
    },
    {
      label: MANAGER_TEXT.duplicate,
      items: [
        { command: ID.duplicateSprite, label: MANAGER_TEXT.duplicate, ...sprites },
        { command: 'sprite.duplicate_named', label: SPRITE_MENU.duplicateNamed, ...sprites },
      ],
    },
    folderEntries(manager),
    transformEntries(manager),
    orderEntries(manager),
    sheetEntries(manager),
    makeEntries(manager),
    selectEntries(manager),
    { command: 'sprite.show_in_project', label: MANAGER_TEXT.showInProject },
    'separator',
    { command: ID.askDeleteSprite, label: MANAGER_TEXT.deleteFiles, tone: 'danger', ...sprites },
  ];
};

export { spriteMenuEntries };
