/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import type { SpriteSettings } from '../stores/sprite-store.type';
import type { LayerRow, SpriteHeader } from './stage-header.type';

interface SpriteFlags extends Pick<SpriteSettings, 'isolated' | 'broadcast' | 'spritesScope' | 'layerScope'> {
  mode: SpriteSettings['mode'];
  selected: number;
}

const stateOf = (layer: Pick<Layer, 'locked' | 'visible'>): LayerRow['state'] => {
  if (layer.locked) return 'locked';
  return layer.visible ? '' : 'hidden';
};

const readSpriteHeader = (target: EditorTarget, flags: SpriteFlags): SpriteHeader => ({
  name: target.sprite.name,
  layers: target.sprite.layers.map((layer) => ({ id: layer.id, name: layer.name, state: stateOf(layer), active: layer.id === target.layerId })),
  multi: flags.selected > 1,
  count: flags.selected,
  broadcast: flags.broadcast,
  canBroadcast: flags.mode === 'sprite' && flags.selected > 1,
  isolated: flags.isolated,
  spritesScope: flags.spritesScope,
  layerScope: flags.layerScope,
});

export type { SpriteFlags };
export { readSpriteHeader, stateOf };
