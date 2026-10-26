/* @layer renderer-app @kind logic */
import type { RowMoveTarget } from '@drizztdourden08/tessera';
import type { SpriteId } from '@bxel/document';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import type { ManagerModel } from '../SpritesPanel.type';

const slotOf = (model: ManagerModel, from: SpriteId, target: RowMoveTarget): number | null => {
  const at = (key: string | undefined): number => (key === undefined ? -1 : model.artwork.sprites.findIndex((sprite) => sprite.id === key));
  const origin = at(from);
  const before = at(target.beforeKey);
  if (before >= 0) return origin >= 0 && origin < before ? before - 1 : before;
  const after = at(target.afterKey);
  if (after < 0) return null;
  return origin >= 0 && origin < after ? after : after + 1;
};

const moveRow = (model: ManagerModel, fromKey: string, target: RowMoveTarget): void => {
  const from = model.artwork.sprites.find((sprite) => sprite.id === fromKey)?.id;
  const to = from === undefined ? null : slotOf(model, from, target);
  if (from === undefined || to === null) return;
  reorderSprites(model.ids.includes(from) ? model.ids : [from], { to });
};

export { moveRow };
