/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem, ShortcutKey } from '@drizztdourden08/tessera';
import { hintFace } from '../../../toolbar-items';
import { TRANSFORM_ACTIONS } from '../sub-components/TransformMenu.constants';

const transformGroups = (keys: Readonly<Record<string, readonly ShortcutKey[] | undefined>>): MenuGroup[] => [
  {
    id: 'transform',
    items: TRANSFORM_ACTIONS.map((action): MenuItem => {
      const { label, description, shortcut } = hintFace(action.hint, keys[action.id]);
      return { id: action.id, label, description, shortcut, onSelect: action.run };
    }),
  },
];

export { transformGroups };
