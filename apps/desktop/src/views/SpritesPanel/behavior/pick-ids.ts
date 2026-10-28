/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { selectEntries } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';

const pickIds = (known: ReadonlyMap<string, SpriteId>, animations: ReadonlySet<string>) => (ids: ReadonlySet<string>): void => {
  if (ids.size === 0) clearSpriteSelection();
  else selectEntries([...ids].flatMap((id) => known.get(id) ?? []), [...ids].filter((id) => animations.has(id)));
};

export { pickIds };
