/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';

const pickIds = (known: ReadonlyMap<string, SpriteId>) => (ids: ReadonlySet<string>): void => {
  if (ids.size === 0) clearSpriteSelection();
  else selectIds([...ids].flatMap((id) => known.get(id) ?? []));
};

export { pickIds };
