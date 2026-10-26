/* @layer renderer-app @kind hook */
import type { DataTableHandle } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import type { ManagerModel, SpriteKeyHandler } from '../SpritesPanel.type';
import { columnsOf } from './columns-of';
import { commandAction } from './command-action';
import { navAction } from './nav-action';
import { ownsKey } from './owns-key';
import { tableOrder } from './table-order';

const useSpritesKeys = (model: ManagerModel | null, table: RefObject<DataTableHandle | null>): SpriteKeyHandler => (event) => {
  const active = model?.scene.active;
  if (!model || !active || event.defaultPrevented || ownsKey(event.target, event.key)) return;
  const shown = { ...model, order: tableOrder(table, model) };
  const action = navAction(event, shown, columnsOf(event.currentTarget)) ?? commandAction(event, shown);
  if (!action) return;
  event.preventDefault();
  event.stopPropagation();
  action();
};

export { useSpritesKeys };
