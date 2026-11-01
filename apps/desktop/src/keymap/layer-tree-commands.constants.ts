/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { LayerArgs } from '../context-menu/menu-args.type';
import { commandLayers } from '../editor/command-layers';
import type { CommandLayers } from '../editor/command-layers.type';
import { LAYER_LABEL } from '../editor/layer-text.constants';
import { useLayerViewStore } from '../stores/useLayerViewStore';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.layers;

const onLayers = (run: (now: CommandLayers) => void) => (context?: CommandContext): void => {
  const now = commandLayers(commandArgs<LayerArgs>(context).layerId);
  if (now) run(now);
};

const inList = (chord: string) => ({ chord, zone: COMMAND_ZONE.layers, whileTyping: false });

const LAYER_TREE_COMMANDS: readonly CommandDef[] = [
  { id: COMMAND_ID.layerGroup, label: LAYER_LABEL.group, group, ...inList('Mod+G'), run: onLayers((now) => now.actions.group(now.ids)) },
  { id: COMMAND_ID.layerUngroup, label: LAYER_LABEL.ungroup, group, ...inList('Mod+Shift+G'), run: onLayers((now) => now.actions.ungroup(now.id)) },
  { id: COMMAND_ID.layerMergeSelected, label: LAYER_LABEL.mergeSelected, group, run: onLayers((now) => now.actions.mergeSelected(now.ids)) },
  { id: COMMAND_ID.layerToLayer, label: LAYER_LABEL.toLayer, group, chord: 'Mod+J', run: onLayers((now) => now.actions.toLayer(false)) },
  { id: COMMAND_ID.layerCutToLayer, label: LAYER_LABEL.cutToLayer, group, chord: 'Mod+Shift+J', run: onLayers((now) => now.actions.toLayer(true)) },
  { id: COMMAND_ID.layerReferenceAdd, label: LAYER_LABEL.reference, group, run: onLayers((now) => now.actions.addReference()) },
  { id: COMMAND_ID.layerReferenceRelink, label: LAYER_LABEL.relink, group, run: onLayers((now) => now.actions.relink(now.id)) },
  { id: COMMAND_ID.layerHighlight, label: 'Highlight current layer', group, chord: 'Alt+H', run: () => useLayerViewStore.getState().toggleHighlight() },
].map(ruled);

export { LAYER_TREE_COMMANDS };
