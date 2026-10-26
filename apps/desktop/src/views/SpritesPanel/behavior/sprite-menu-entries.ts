/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { SHEET_COMMAND as ID } from '../../../keymap/sheet-command-id.constants';
import { COMPOSE_TEXT } from '../../../sheet-manager/compose-text.constants';
import { currentManager } from '../../../sheet-manager/current-manager';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { MARQUEE_ITEM, SPRITE_MENU } from '../SpritesPanel.constants';
import { orderEntries } from './order-entries';
import { selectEntries } from './select-entries';
import { sheetEntries } from './sheet-entries';
import { EMPTY_ENTRIES } from './sprite-menu-entries.constants';
import { transformEntries } from './transform-entries';

const spriteMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const manager = currentManager();
  if (!manager || menuTarget(context, MARQUEE_ITEM) === null) return EMPTY_ENTRIES;
  const { ids, facts } = manager;
  const picked = new Set(ids);
  const animated = facts.some((fact) => picked.has(fact.sprite.id) && fact.frames > 1);
  const pick = unless(ids.length > 0, MANAGER_TEXT.none);
  return [
    { command: ID.isolate, label: SPRITE_MENU.edit, ...pick },
    { command: ID.renameSprite, label: MANAGER_TEXT.rename, ...pick },
    { command: 'sprite.rename_many', label: SPRITE_MENU.renameMany, ...unless(ids.length > 1, SPRITE_MENU.needTwo) },
    { command: ID.duplicateSprite, label: MANAGER_TEXT.duplicate, ...pick },
    { command: 'sprite.duplicate_named', label: SPRITE_MENU.duplicateNamed, ...pick },
    { command: 'sprite.move_to_folder', label: SPRITE_MENU.moveToFolder, ...pick },
    transformEntries(manager),
    orderEntries(manager),
    sheetEntries(manager),
    {
      label: COMPOSE_TEXT.group,
      items: [
        { command: 'sprite.merge', label: COMPOSE_TEXT.merge, ...unless(picked.size > 1, COMPOSE_TEXT.needTwo) },
        { command: 'sprite.split', label: COMPOSE_TEXT.split, ...unless(animated, SPRITE_MENU.notAnimated) },
        { command: 'sprite.slice', label: COMPOSE_TEXT.slice, ...pick },
      ],
    },
    selectEntries(manager),
    'separator',
    { command: ID.askDeleteSprite, tone: 'danger' },
  ];
};

export { spriteMenuEntries };
