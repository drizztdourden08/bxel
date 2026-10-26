/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { LayerArgs } from '../context-menu/menu-args.type';
import { moveLayerBy } from '../editor/move-layer-by';
import { soloLayer } from '../editor/solo-layer';
import { toggleLayerFlag } from '../editor/toggle-layer-flag';
import { inMapPlace } from '../tilemap/in-map-place';
import { toggleMapLayerFlag } from '../tilemap/toggle-map-layer-flag';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';
import { pixelCommand } from './pixel-command';

const group = COMMAND_GROUP.layers;

const layerOf = (context: CommandContext | undefined): string | undefined => commandArgs<LayerArgs>(context).layerId;

const toggle = (flag: 'visible' | 'locked') => (context?: CommandContext): void => {
  if (inMapPlace()) toggleMapLayerFlag(flag, layerOf(context));
  else toggleLayerFlag(flag, layerOf(context));
};

const LAYER_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'layer.toggle_visible', label: 'Show or hide layer', group, run: toggle('visible') },
  { id: 'layer.toggle_locked', label: 'Lock or unlock layer', group, run: toggle('locked') },
  pixelCommand({ id: 'layer.solo', label: 'Show only this layer', group, run: (context) => soloLayer(layerOf(context)) }),
  pixelCommand({ id: 'layer.move_up', label: 'Move layer up', group, run: (context) => moveLayerBy('up', layerOf(context)) }),
  pixelCommand({ id: 'layer.move_down', label: 'Move layer down', group, run: (context) => moveLayerBy('down', layerOf(context)) }),
].map(editorCommand);

export { LAYER_MENU_COMMANDS };
