/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { LayerArgs, LayerColourArgs, LayerLockArgs } from '../context-menu/menu-args.type';
import { commandLayers } from '../editor/command-layers';
import type { CommandLayers } from '../editor/command-layers.type';
import { moveLayerBy } from '../editor/move-layer-by';
import { moveLayerToEdge } from '../editor/move-layer-to-edge';
import { inMapPlace } from '../tilemap/in-map-place';
import { moveMapLayer } from '../tilemap/move-map-layer';
import { moveMapLayerToEdge } from '../tilemap/move-map-layer-to-edge';
import { COMMAND_ZONE } from './command-zone.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const group = COMMAND_GROUP.layers;

const layerOf = (context: CommandContext | undefined): string | undefined => commandArgs<LayerArgs>(context).layerId;

const onLayers = (run: (now: CommandLayers, context: CommandContext | undefined) => void) => (context?: CommandContext): void => {
  const now = commandLayers(layerOf(context));
  if (now) run(now, context);
};

const move = (direction: 'up' | 'down') => (context?: CommandContext): void => {
  if (inMapPlace()) moveMapLayer(direction === 'up' ? 1 : -1, layerOf(context));
  else moveLayerBy(direction, layerOf(context));
};

const moveToEdge = (edge: 'top' | 'bottom') => (context?: CommandContext): void => {
  if (inMapPlace()) moveMapLayerToEdge(edge, layerOf(context));
  else moveLayerToEdge(edge, layerOf(context));
};

const inList = (chord: string) => ({ chord, zone: COMMAND_ZONE.layers, whileTyping: false });

const LAYER_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'layer.toggle_visible', label: 'Show or hide layer', group, ...inList('Alt+V'), run: onLayers((now) => now.actions.setFlag(now.ids, 'visible', !now.visible)) },
  { id: 'layer.toggle_locked', label: 'Lock or unlock layer', group, ...inList('Alt+L'), run: onLayers((now) => now.actions.setLock(now.ids, now.lock === 'none' ? 'pixels' : 'none')) },
  {
    id: 'layer.set_lock',
    label: 'Set layer lock',
    group,
    run: onLayers((now, context) => {
      const { kind } = commandArgs<LayerLockArgs>(context);
      if (kind) now.actions.setLock(now.ids, kind);
    }),
  },
  {
    id: 'layer.set_colour',
    label: 'Set layer colour',
    group,
    run: onLayers((now, context) => {
      const { colour } = commandArgs<LayerColourArgs>(context);
      if (colour !== undefined) now.actions.setColour(now.ids, colour);
    }),
  },
  { id: 'layer.solo', label: 'Show only this layer', group, ...inList('Alt+S'), run: onLayers((now) => now.actions.solo(now.id)) },
  { id: 'layer.show_all', label: 'Show all layers', group, run: onLayers((now) => now.actions.setFlag(now.all, 'visible', true)) },
  { id: 'layer.hide_others', label: 'Hide other layers', group, run: onLayers((now) => now.actions.setFlag(now.others, 'visible', false)) },
  { id: 'layer.lock_others', label: 'Lock other layers', group, run: onLayers((now) => now.actions.setFlag(now.others, 'locked', true)) },
  { id: 'layer.unlock_all', label: 'Unlock all layers', group, run: onLayers((now) => now.actions.setLock(now.all, 'none')) },
  { id: 'layer.move_up', label: 'Move layer up', group, run: move('up') },
  { id: 'layer.move_down', label: 'Move layer down', group, run: move('down') },
  { id: 'layer.move_top', label: 'Move layer to top', group, run: moveToEdge('top') },
  { id: 'layer.move_bottom', label: 'Move layer to bottom', group, run: moveToEdge('bottom') },
].map(editorCommand);

export { LAYER_MENU_COMMANDS };
