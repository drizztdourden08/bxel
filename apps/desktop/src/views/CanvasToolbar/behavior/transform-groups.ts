/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { hintFace } from '../../../toolbar-items';
import { CANVAS_ACTIONS, TRANSFORM_ACTIONS } from '../sub-components/TransformMenu.constants';
import type { TransformAction, TransformKeys } from '../CanvasToolbar.type';

const menuItem = (action: TransformAction, keys: TransformKeys, hasSelection: boolean): MenuItem => {
  const { label, description, shortcut } = hintFace(action.hint, keys[action.id]);
  const disabled = action.needsSelection === true && !hasSelection;
  return { id: action.id, label, description, shortcut, icon: action.icon, disabled, onSelect: action.run };
};

const transformGroups = (keys: TransformKeys, hasSelection: boolean): MenuGroup[] => [
  { id: 'transform', items: TRANSFORM_ACTIONS.map((action) => menuItem(action, keys, hasSelection)) },
  { id: 'canvas', items: CANVAS_ACTIONS.map((action) => menuItem(action, keys, hasSelection)) },
];

export { transformGroups };
