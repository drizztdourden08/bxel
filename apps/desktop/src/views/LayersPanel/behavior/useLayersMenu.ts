/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { currentTarget } from '../../../editor/current-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { LAYER_MENU } from '../LayersPanel.constants';
import { layerMenuEntries } from './layer-menu-entries';
import { ruledEntries } from '../../../context-menu/ruled-entries';

const selectClicked = (context: ContextMenuContext): void => {
  const layer = currentTarget()?.sprite.layers.find((each) => each.id === menuTarget(context, LAYER_MENU.row)?.dataset.reorderKey);
  if (layer) useToolStore.getState().setLayer(layer.id);
};

const useLayersMenu = (): void => {
  useContextMenu(COMMAND_ZONE.layers, { label: LAYER_MENU.label, beforeOpen: selectClicked, entries: ruledEntries(layerMenuEntries) });
};

export { useLayersMenu };
