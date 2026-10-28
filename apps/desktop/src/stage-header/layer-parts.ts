/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { layersGroups } from '../sheet/layers-groups';
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderActions, HeaderChip, SpriteHeader } from './stage-header.type';

const suffix = (state: string): string => (state === '' ? '' : ` (${state})`);

const layerMenu = (sprite: SpriteHeader, actions: HeaderActions): MenuGroup[] => [
  {
    id: 'layer-pick',
    label: HEADER_TEXT.layerMenu,
    items: [...sprite.layers].reverse().map((layer) => ({
      id: layer.id,
      label: `${layer.name}${suffix(layer.state)}`,
      kind: 'radio' as const,
      checked: layer.active,
      onSelect: () => actions.pickLayer(layer.id),
    })),
  },
  ...(sprite.multi ? layersGroups(sprite.layerScope, actions.setLayerScope).map((group) => ({ ...group, label: HEADER_TEXT.scopeMenu })) : []),
];

const layerCrumb = (sprite: SpriteHeader, actions: HeaderActions): Crumb | null => {
  const active = sprite.layers.find((layer) => layer.active);
  if (!active) return null;
  return {
    id: 'layer',
    label: HEADER_TEXT.layer(active.name),
    icon: 'pixel-layers',
    note: active.state === '' ? undefined : active.state,
    menu: layerMenu(sprite, actions),
    current: true,
  };
};

const layerChips = (sprite: SpriteHeader, actions: HeaderActions, readOnly: boolean): HeaderChip[] => {
  const active = sprite.layers.find((layer) => layer.active);
  if (!active || active.state === '') return [];
  const locked = active.state === 'locked';
  return [
    {
      id: 'layer-state',
      text: locked ? HEADER_TEXT.locked : HEADER_TEXT.hidden,
      tone: locked ? 'danger' : 'warning',
      icon: locked ? 'pixel-lock' : 'eye-off',
      title: locked ? HEADER_TEXT.lockedTitle : HEADER_TEXT.hiddenTitle,
      action: {
        label: locked ? HEADER_TEXT.unlock : HEADER_TEXT.show,
        disabled: readOnly,
        run: () => actions.toggleLayerFlag(locked ? 'locked' : 'visible', active.id),
      },
    },
  ];
};

export { layerChips, layerCrumb };
