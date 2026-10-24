/* @layer renderer-app @kind constants */
import { addLayer } from '../../editor/add-layer';
import { deleteLayer } from '../../editor/delete-layer';
import { duplicateLayer } from '../../editor/duplicate-layer';
import { flattenLayers } from '../../editor/flatten-layers';
import { mergeLayerDown } from '../../editor/merge-layer-down';
import type { LayerAction, LayerToggle } from './LayersPanel.type';

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

const LAYER_LIST_TEXT = {
  moved: (name: string, position: number, total: number): string => `${name} moved to position ${position} of ${total}`,
  moveHint: 'Alt and Up or Down moves the row',
} as const;

const LAYER_MOVE_KEYS = 'Alt+ArrowUp Alt+ArrowDown';

const LAYER_FOCUS_KEYS: Readonly<Record<string, 'first' | 'last'>> = { Home: 'first', End: 'last' };

const LAYER_TOGGLES: readonly LayerToggle[] = [
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

export { LAYER_ACTIONS, LAYER_FOCUS_KEYS, LAYER_LIST_TEXT, LAYER_MOVE_KEYS, LAYER_TOGGLES, LAYERS_PANEL_TEXT };
