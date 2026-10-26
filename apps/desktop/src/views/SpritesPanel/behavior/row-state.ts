/* @layer renderer-app @kind logic */
import type { RowState } from '@drizztdourden08/tessera';
import type { SpriteId } from '@bxel/document';
import type { ListRow, ManagerModel } from '../SpritesPanel.type';

const rowStateOf = (model: ManagerModel, affected: readonly SpriteId[]): ((row: ListRow) => RowState | undefined) => {
  const pending = new Set(affected);
  const active = model.scene.active?.id;
  return (row) => {
    if (pending.has(row.id)) return 'pending';
    if (row.id === active) return 'active';
    return row.loose ? 'muted' : undefined;
  };
};

export { rowStateOf };
