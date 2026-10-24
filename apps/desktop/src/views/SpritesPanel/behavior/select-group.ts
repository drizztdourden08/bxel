/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { invertIds } from '../../../sheet-manager/invert-ids';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import type { ActionContext } from '../SpritesPanel.type';

const selectGroup = ({ model }: ActionContext): MenuGroup => ({
  id: 'select',
  label: MANAGER_TEXT.groups.select,
  items: [
    { id: 'select-all', label: MANAGER_TEXT.selectAll, shortcut: 'Ctrl+A', onSelect: () => selectIds(model.order) },
    {
      id: 'select-none',
      label: MANAGER_TEXT.selectNone,
      shortcut: 'Esc',
      disabled: model.scene.selected.length === 0,
      onSelect: clearSpriteSelection,
    },
    {
      id: 'select-invert',
      label: MANAGER_TEXT.invert,
      onSelect: () =>
        selectIds(
          invertIds(
            model.order,
            model.scene.selected.map((sprite) => sprite.id),
          ),
        ),
    },
    {
      id: 'select-loose',
      label: MANAGER_TEXT.selectUnplaced,
      disabled: model.sheet === null,
      onSelect: () => selectIds(model.facts.filter((fact) => !fact.onSheet).map((fact) => fact.sprite.id)),
    },
  ],
});

export { selectGroup };
