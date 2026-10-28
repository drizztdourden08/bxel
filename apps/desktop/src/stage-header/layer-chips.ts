/* @layer renderer-app @kind logic */
import { stateChip } from './state-chip';
import type { HeaderActions, HeaderChip, SpriteHeader } from './stage-header.type';

const layerChips = (sprite: SpriteHeader, actions: HeaderActions, readOnly: boolean): HeaderChip[] => {
  const active = sprite.layers.find((layer) => layer.active);
  if (!active || active.state === '') return [];
  const locked = active.state === 'locked';
  return [stateChip({ locked, readOnly, run: () => actions.toggleLayerFlag(locked ? 'locked' : 'visible', active.id) })];
};

export { layerChips };
