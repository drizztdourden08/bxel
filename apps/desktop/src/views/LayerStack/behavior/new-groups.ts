/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { LAYER_TEXT } from '../../../editor/layer-text.constants';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerStackModel } from '../LayerStack.type';

const newGroups = (model: LayerStackModel): MenuGroup[] => {
  const flat = model.kind === 'sprite';
  const visible = model.rows.some((row) => row.visible);
  return [
    {
      id: 'new',
      items: [
        { id: 'new-layer', label: LAYER_STACK_TEXT.newLayer, icon: 'plus', onSelect: model.actions.add },
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
