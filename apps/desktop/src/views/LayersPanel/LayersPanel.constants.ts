/* @layer renderer-app @kind constants */
import { addLayer } from '../../editor/add-layer';
import { deleteLayer } from '../../editor/delete-layer';
import { duplicateLayer } from '../../editor/duplicate-layer';
import { flattenLayers } from '../../editor/flatten-layers';
import { mergeLayerDown } from '../../editor/merge-layer-down';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import type { LayerAction, LayerToggle } from './LayersPanel.type';

const LAYERS_PANEL_TEXT = {
  empty: 'No sprite is open.',
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
  {
    id: 'visible',
    iconOn: 'eye',
    iconOff: 'eye-off',
    hint: { name: 'Visible', description: 'Show or hide this layer. A hidden layer cannot be drawn on.' },
  },
  {
    id: 'locked',
    iconOn: 'lock',
    iconOff: 'lock-open',
    hint: { name: 'Locked', description: 'Lock this layer so nothing can be drawn on it by mistake.' },
  },
];

const LAYER_ACTIONS: readonly LayerAction[] = [
  {
    id: 'add',
    icon: 'plus',
    run: addLayer,
    hint: { name: 'New layer', description: 'Add an empty layer above the current one.', shortcuts: [{ command: COMMAND_ID.layerAdd }] },
  },
  {
    id: 'duplicate',
    icon: 'copy',
    run: duplicateLayer,
    hint: { name: 'Duplicate layer', description: 'Make a copy of the current layer.', shortcuts: [{ command: COMMAND_ID.layerDuplicate }] },
  },
  {
    id: 'merge',
    icon: 'arrow-down',
    run: mergeLayerDown,
    hint: { name: 'Merge down', description: 'Join the current layer into the layer below it.', shortcuts: [{ command: COMMAND_ID.layerMerge }] },
  },
  {
    id: 'flatten',
    icon: 'pixel-layers',
    run: flattenLayers,
    hint: {
      name: 'Flatten copy',
      description: 'Add one layer that joins all visible layers. The originals stay.',
      shortcuts: [{ command: COMMAND_ID.layerFlatten }],
    },
  },
  {
    id: 'delete',
    icon: 'trash-2',
    run: deleteLayer,
    hint: {
      name: 'Delete layer',
      description: 'Remove the current layer. A sprite keeps at least one layer.',
      shortcuts: [{ command: COMMAND_ID.layerDelete }, { keys: ['delete'], label: 'In the list' }],
    },
  },
];

export { LAYER_ACTIONS, LAYER_FOCUS_KEYS, LAYER_LIST_TEXT, LAYER_MOVE_KEYS, LAYER_TOGGLES, LAYERS_PANEL_TEXT };
