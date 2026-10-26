/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { currentMap } from '../../../tilemap/current-map';
import { MAP_LAYER_MENU } from '../MapLayersPanel.constants';
import { mapLayerMenuEntries } from './map-layer-menu-entries';

const selectClicked = (context: ContextMenuContext): void => {
  const layer = currentMap()?.tilemap.layers.find((each) => each.id === menuTarget(context, MAP_LAYER_MENU.row)?.dataset.layerId);
  if (layer) useTilemapStore.getState().setLayer(layer.id);
};

const useMapLayersMenu = (): void => {
  useContextMenu(COMMAND_ZONE.layers, { label: MAP_LAYER_MENU.label, beforeOpen: selectClicked, entries: mapLayerMenuEntries });
};

export { useMapLayersMenu };
