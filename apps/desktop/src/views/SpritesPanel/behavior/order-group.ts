/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuNode } from '@drizztdourden08/tessera';
import { applyOrder } from '../../../sheet-manager/apply-order';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { sortFacts } from '../../../sheet-manager/sort-facts';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { END_INDEX } from '../SpritesPanel.constants';
import type { ActionContext } from '../SpritesPanel.type';

const viewOrder = ({ model, sortKey }: ActionContext): MenuNode[] => {
  if (sortKey === 'manual' || model.shown.length !== model.facts.length) return [];
  return [{ id: 'use-order', label: MANAGER_TEXT.useOrder, onSelect: () => applyOrder(model.shown.map((fact) => fact.sprite.id)) }];
};

const orderGroup = (ctx: ActionContext): MenuGroup => {
  const { model } = ctx;
  const none = model.ids.length === 0;
  const byName = sortFacts(model.facts, 'name', false).map((fact) => fact.sprite.id);
  return {
    id: 'order',
    label: MANAGER_TEXT.groups.order,
    items: [
      { id: 'earlier', label: MANAGER_TEXT.earlier, shortcut: 'Alt+Left', icon: 'arrow-left', disabled: none, onSelect: () => reorderSprites(model.ids, { by: -1 }) },
      { id: 'later', label: MANAGER_TEXT.later, shortcut: 'Alt+Right', icon: 'arrow-right', disabled: none, onSelect: () => reorderSprites(model.ids, { by: 1 }) },
      { id: 'to-start', label: MANAGER_TEXT.toTop, disabled: none, onSelect: () => reorderSprites(model.ids, { to: 0 }) },
      { id: 'to-end', label: MANAGER_TEXT.toEnd, disabled: none, onSelect: () => reorderSprites(model.ids, { to: END_INDEX }) },
      { id: 'sort-name', label: MANAGER_TEXT.sortByName, onSelect: () => applyOrder(byName) },
      ...viewOrder(ctx),
    ],
  };
};

export { orderGroup };
