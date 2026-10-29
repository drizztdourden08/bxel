/* @layer renderer-app @kind logic */
import type { RowMoveTarget } from '@drizztdourden08/tessera';
import { dropEntries } from '../../../sheet-manager/drop-entries';
import type { DropTarget } from '../../../sheet-manager/drag-payload.type';
import type { ManagerModel } from '../SpritesPanel.type';
import { dragEntriesOf } from './drag-entries-of';

const targetOf = (target: RowMoveTarget): DropTarget | null => {
  if (target.beforeKey !== undefined) return { key: target.beforeKey, side: 'before' };
  if (target.afterKey !== undefined) return { key: target.afterKey, side: 'after' };
  return null;
};

const moveRow = (model: ManagerModel, fromKey: string, target: RowMoveTarget): void => {
  const drop = targetOf(target);
  if (drop) dropEntries(dragEntriesOf(model, fromKey), drop, model.sheet?.id ?? null);
};

export { moveRow };
