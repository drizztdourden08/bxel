/* @layer renderer-app @kind logic */
import { layerLabel } from './layer-label';
import { layerMenu } from './layer-menu';
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderActions, SpriteHeader } from './stage-header.type';

const layerCrumb = (sprite: SpriteHeader, actions: HeaderActions): Crumb | null => {
  const active = sprite.layers.find((layer) => layer.active);
  if (!active) return null;
  return {
    id: 'layer',
    label: sprite.multi ? layerLabel(sprite, active.name) : HEADER_TEXT.layer(active.name),
    icon: 'pixel-layers',
    note: active.state === '' ? undefined : active.state,
    menu: layerMenu(sprite, actions),
    current: true,
  };
};

export { layerCrumb };
