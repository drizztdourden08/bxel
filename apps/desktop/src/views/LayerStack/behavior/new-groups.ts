/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { LAYER_TEXT } from '../../../editor/layer-text.constants';
import { LAYER_MENU_TEXT, LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerStackModel } from '../LayerStack.type';

const newGroups = (model: LayerStackModel, picked: readonly string[]): MenuGroup[] => {
  const flat = model.kind === 'sprite';
  const visible = model.rows.some((row) => row.visible);
  return [
    {
      id: 'new',
      items: [
        { id: 'new-layer', label: LAYER_STACK_TEXT.newLayer, icon: 'plus', onSelect: model.actions.add },
        ...(flat
          ? [
              { id: 'new-group', label: LAYER_MENU_TEXT.group, icon: 'folder' as const, onSelect: () => model.actions.group(picked) },
              { id: 'new-reference', label: LAYER_MENU_TEXT.reference, icon: 'image' as const, onSelect: model.actions.addReference },
              { id: 'new-from-selection', label: LAYER_MENU_TEXT.toLayer, icon: 'layers' as const, onSelect: () => model.actions.toLayer(false) },
            ]
          : []),
        ...(flat
          ? [
              {
                id: 'new-flat',
                label: 'Flatten copy',
                icon: 'pixel-layers' as const,
                description: visible ? 'Add one layer that joins all visible layers. The originals stay.' : LAYER_TEXT.noVisible,
                disabled: !visible,
                onSelect: model.actions.flatten,
              },
            ]
          : []),
      ],
    },
  ];
};

export { newGroups };
