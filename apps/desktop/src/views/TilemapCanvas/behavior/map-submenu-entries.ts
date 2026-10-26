/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { COLLISION_COMMAND } from '../../../keymap/collision-command-id.constants';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { TERRAIN_COMMAND } from '../../../keymap/terrain-command-id.constants';
import { TILEMAP_COMMAND as ID } from '../../../keymap/tilemap-command-id.constants';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import { MAP_MENU } from '../TilemapCanvas.constants';

const mapSubmenuEntries = (target: MapTarget): ContextMenuEntry => {
  const layers = target.tilemap.layers;
  const at = layers.findIndex((each) => each.id === target.layer.id);
  return {
    label: MAP_MENU.map,
    items: [
      COLLISION_COMMAND.toggleOverlay,
      TERRAIN_COMMAND.toggleBrush,
      { command: COMMAND_ID.layerAdd, label: MAP_MENU.addLayer },
      { command: ID.layerUp, ...unless(at < layers.length - 1, MAP_MENU.top) },
      { command: ID.layerDown, ...unless(at > 0, MAP_MENU.bottom) },
    ],
  };
};

export { mapSubmenuEntries };
