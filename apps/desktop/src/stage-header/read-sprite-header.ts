/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import { layerStateOf } from './layer-state-of';
import type { SpriteFlags } from './read-sprite-header.type';
import type { SpriteHeader } from './stage-header.type';

const readSpriteHeader = (target: EditorTarget, flags: SpriteFlags): SpriteHeader => ({
  name: target.sprite.name,
  layers: target.sprite.layers.map((layer) => ({ id: layer.id, name: layer.name, state: layerStateOf(layer), active: layer.id === target.layerId })),
  multi: flags.selected > 1,
  count: flags.selected,
  broadcast: flags.broadcast,
  canBroadcast: flags.mode === 'sprite' && flags.selected > 1,
  isolated: flags.isolated,
  spritesScope: flags.spritesScope,
  layerScope: flags.layerScope,
});

export { readSpriteHeader };
