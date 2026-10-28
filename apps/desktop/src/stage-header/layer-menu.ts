/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { layersGroups } from '../sheet/layers-groups';
import { HEADER_TEXT } from './stage-header.constants';
import type { HeaderActions, SpriteHeader } from './stage-header.type';

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

export { layerMenu };
