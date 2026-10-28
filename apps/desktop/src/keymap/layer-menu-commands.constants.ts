/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { LayerArgs } from '../context-menu/menu-args.type';
import { moveLayerBy } from '../editor/move-layer-by';
import { soloLayer } from '../editor/solo-layer';
import { toggleLayerFlag } from '../editor/toggle-layer-flag';
import { inMapPlace } from '../tilemap/in-map-place';
import { toggleMapLayerFlag } from '../tilemap/toggle-map-layer-flag';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.layers;

const layerOf = (context: CommandContext | undefined): string | undefined => commandArgs<LayerArgs>(context).layerId;

const toggle = (flag: 'visible' | 'locked') => (context?: CommandContext): void => {
  if (inMapPlace()) toggleMapLayerFlag(flag, layerOf(context));
  else toggleLayerFlag(flag, layerOf(context));
};

const LAYER_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'layer.toggle_visible', label: 'Show or hide layer', group, run: toggle('visible') },
  { id: 'layer.toggle_locked', label: 'Lock or unlock layer', group, run: toggle('locked') },
  { id: 'layer.solo', label: 'Show only this layer', group, run: (context?: CommandContext) => soloLayer(layerOf(context)) },
  { id: 'layer.move_up', label: 'Move layer up', group, run: (context?: CommandContext) => moveLayerBy('up', layerOf(context)) },
  { id: 'layer.move_down', label: 'Move layer down', group, run: (context?: CommandContext) => moveLayerBy('down', layerOf(context)) },
].map(ruled);

export { LAYER_MENU_COMMANDS };
