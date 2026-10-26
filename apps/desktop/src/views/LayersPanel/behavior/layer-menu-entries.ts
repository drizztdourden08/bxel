/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { LAYER_MENU } from '../LayersPanel.constants';
import { layerEntriesFor } from './layer-entries-for';

const layerMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] =>
  layerEntriesFor(menuTarget(context, LAYER_MENU.row)?.dataset.reorderKey);

export { layerMenuEntries };
