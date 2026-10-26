/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import { currentMap } from '../../../tilemap/current-map';
import { MAP_LAYER_MENU } from '../MapLayersPanel.constants';

const newLayerOnly: readonly ContextMenuEntry[] = [{ command: COMMAND_ID.layerAdd, label: MAP_LAYER_MENU.add }];

const mapLayerMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const layers = currentMap()?.tilemap.layers ?? [];
  const at = layers.findIndex((each) => each.id === menuTarget(context, MAP_LAYER_MENU.row)?.dataset.layerId);
  const layer = layers[at];
  if (!layer) return newLayerOnly;
  const args = { layerId: layer.id };
  return [
    { command: 'layer.toggle_visible', label: MAP_LAYER_MENU.visible, args, checked: layer.visible },
    { command: 'layer.toggle_locked', label: MAP_LAYER_MENU.locked, args, checked: layer.locked },
    { command: 'layer.rename', label: MAP_LAYER_MENU.rename },
    'separator',
    newLayerOnly[0] ?? COMMAND_ID.layerAdd,
    { command: TILEMAP_COMMAND.layerUp, label: MAP_LAYER_MENU.up, ...unless(at < layers.length - 1, MAP_LAYER_MENU.top) },
    { command: TILEMAP_COMMAND.layerDown, label: MAP_LAYER_MENU.down, ...unless(at > 0, MAP_LAYER_MENU.bottom) },
    'separator',
    { command: COMMAND_ID.layerDelete, label: MAP_LAYER_MENU.remove, ...unless(layers.length > 1, MAP_LAYER_MENU.last) },
  ];
};

export { mapLayerMenuEntries };
