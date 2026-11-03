/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { SavedSelection } from '../../sheet-manager/folders.type';
import type { SetViewInput } from './app-tool-input.type';

type IncomingSelections = NonNullable<NonNullable<SetViewInput['sprites']>['selections']>;

const savedSelections = (incoming: IncomingSelections): SavedSelection[] => {
  const named = incoming.map((each): [string, SavedSelection] => [each.name, { name: each.name, ids: each.ids as SpriteId[] }]);
  return [...new Map(named).values()];
};

export { savedSelections };
