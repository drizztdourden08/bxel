/* @layer renderer-app @kind constants */
import type { ReorderToggle } from '@drizztdourden08/tessera';
import { addLayer } from '../../editor/add-layer';
import { deleteLayer } from '../../editor/delete-layer';
import { duplicateLayer } from '../../editor/duplicate-layer';
import { flattenLayers } from '../../editor/flatten-layers';
import { mergeLayerDown } from '../../editor/merge-layer-down';
import type { LayerAction } from './LayersPanel.type';

const LAYERS_PANEL_TEXT = {
  empty: 'No sprite is open.',
  title: 'Layers',
  count: (total: number): string => (total === 1 ? '1 layer' : `${total} layers`),
  list: 'Layers',
  actions: 'Layer actions',
  renameLabel: 'Layer name',
  renameHint: 'Press Enter to keep the name or Escape to cancel.',
  rename: 'Rename layer',
  renameKey: 'F2',
} as const;

const LAYER_TOGGLES: readonly ReorderToggle[] = [
  { id: 'visible', label: 'Visible', iconOn: 'eye', iconOff: 'eye-off' },
  { id: 'locked', label: 'Locked', iconOn: 'lock', iconOff: 'lock-open' },
];

const LAYER_ACTIONS: readonly LayerAction[] = [
  { id: 'add', label: 'New layer', shortcut: 'Shift+N', icon: 'plus', run: addLayer },
  { id: 'duplicate', label: 'Duplicate layer', shortcut: null, icon: 'copy', run: duplicateLayer },
  { id: 'merge', label: 'Merge down', shortcut: 'Ctrl+E', icon: 'arrow-down', run: mergeLayerDown },
  { id: 'flatten', label: 'Flatten copy', shortcut: null, icon: 'layers', run: flattenLayers },
  { id: 'delete', label: 'Delete layer', shortcut: 'Delete', icon: 'trash-2', run: deleteLayer },
];

export { LAYER_ACTIONS, LAYER_TOGGLES, LAYERS_PANEL_TEXT };
