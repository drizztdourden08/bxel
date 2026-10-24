/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { applySelection } from '../../../sheet-manager/apply-selection';
import { SELECTION_TEXT } from '../../../sheet-manager/selection-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { ActionContext } from '../SpritesPanel.type';

const savedGroup = ({ model, open, selections }: ActionContext): MenuGroup => ({
  id: 'saved',
  label: SELECTION_TEXT.group,
  items: [
    { id: 'save-selection', label: SELECTION_TEXT.save, disabled: model.ids.length === 0, onSelect: () => open('selection') },
    ...selections.map((selection) => ({
      id: `saved-${selection.name}`,
      label: selection.name,
      onSelect: () => applySelection(model.artwork, selection),
    })),
    {
      id: 'drop-selection',
      label: SELECTION_TEXT.drop,
      disabled: selections.length === 0,
      children: selections.map((selection) => ({
        id: `drop-${selection.name}`,
        label: selection.name,
        onSelect: () => useManagerStore.getState().dropSelection(selection.name),
      })),
    },
  ],
});

export { savedGroup };
