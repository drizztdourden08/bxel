/* @layer renderer-app @kind constants */
import { COMMAND_ID } from '../../keymap/keymap.constants';
import { TILEMAP_COMMAND } from '../../keymap/tilemap-command-id.constants';
import type { HintSpec } from '../ActionHint';

const MAP_LAYERS_TEXT = {
  empty: 'This file has no tilemap yet.',
  count: (total: number): string => (total === 1 ? '1 layer' : `${total} layers`),
  list: 'Map layers',
  actions: 'Map layer actions',
  maps: 'Tilemap',
  renameLabel: 'Layer name',
  renameHint: 'Press Enter to keep the name or Escape to cancel.',
  renameKey: 'F2',
} as const;

const ADD_LAYER_HINT: HintSpec = {
  name: 'New map layer',
  description: 'Add an empty map layer above the current one.',
  shortcuts: [{ command: COMMAND_ID.layerAdd }],
};

const DELETE_LAYER_HINT: HintSpec = {
  name: 'Delete map layer',
  description: 'Remove the current map layer. A tilemap keeps at least one layer.',
  shortcuts: [{ command: COMMAND_ID.layerDelete }, { keys: ['delete'], label: 'In the list' }],
};

const UP_LAYER_HINT: HintSpec = {
  name: 'Move layer up',
  description: 'Draw the current map layer above the layer over it.',
  shortcuts: [{ command: TILEMAP_COMMAND.layerUp }],
};

const DOWN_LAYER_HINT: HintSpec = {
  name: 'Move layer down',
  description: 'Draw the current map layer below the layer under it.',
  shortcuts: [{ command: TILEMAP_COMMAND.layerDown }],
};

const RENAME_LAYER_HINT: HintSpec = {
  name: 'Rename map layer',
  description: 'Give the current map layer another name.',
  shortcuts: [{ keys: ['F2'], label: 'In the list' }],
};

const VISIBLE_HINT: HintSpec = {
  name: 'Visible',
  description: 'Show or hide this map layer. A hidden layer cannot be drawn on.',
};

const LOCKED_HINT: HintSpec = {
  name: 'Locked',
  description: 'Lock this map layer so no tile can be placed on it by mistake.',
};

export { ADD_LAYER_HINT, DELETE_LAYER_HINT, DOWN_LAYER_HINT, LOCKED_HINT, MAP_LAYERS_TEXT, RENAME_LAYER_HINT, UP_LAYER_HINT, VISIBLE_HINT };
