/* @layer renderer-app @kind logic */
import type { SortKey } from '../../../sheet-manager/manager.type';
import type { ManagerModel } from '../SpritesPanel.type';

const gridColumns = (model: Pick<ManagerModel, 'sheet' | 'facts' | 'shown'>, sortKey: SortKey): number | undefined => {
  const layout = model.sheet?.layout;
  if (sortKey !== 'manual' || layout?.kind !== 'grid' || model.shown.length !== model.facts.length) return undefined;
  return layout.columns >= 1 ? Math.floor(layout.columns) : undefined;
};

export { gridColumns };
