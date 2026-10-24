/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { addLayer } from '../editor/add-layer';
import { deleteLayer } from '../editor/delete-layer';
import { duplicateLayer } from '../editor/duplicate-layer';
import { flattenLayers } from '../editor/flatten-layers';
import { LAYER_LABEL } from '../editor/layer-text.constants';
import { mergeLayerDown } from '../editor/merge-layer-down';
import { stepHistory } from '../editor/step-history';
import { stepLayer } from '../editor/step-layer';
import { addMapLayer } from '../tilemap/add-map-layer';
import { deleteMapLayer } from '../tilemap/delete-map-layer';
import { stepMapLayer } from '../tilemap/step-map-layer';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { mapOr } from './map-or';
import { pixelCommand } from './pixel-command';

const HISTORY_COMMANDS: readonly CommandDef[] = [
  {
    id: COMMAND_ID.undo,
    label: 'Undo',
    group: COMMAND_GROUP.edit,
    chord: 'Mod+Z',
    whileTyping: false,
    run: () => stepHistory('undo'),
  },
  {
    id: COMMAND_ID.redo,
    label: 'Redo',
    group: COMMAND_GROUP.edit,
    chord: ['Mod+Y', 'Mod+Shift+Z'],
    whileTyping: false,
    run: () => stepHistory('redo'),
  },
];

const LAYER_COMMANDS: readonly CommandDef[] = [
  { id: COMMAND_ID.layerAdd, label: LAYER_LABEL.add, group: COMMAND_GROUP.layers, chord: 'Shift+N', run: mapOr(addMapLayer, addLayer) },
  pixelCommand({ id: COMMAND_ID.layerDuplicate, label: LAYER_LABEL.duplicate, group: COMMAND_GROUP.layers, run: duplicateLayer }),
  pixelCommand({ id: COMMAND_ID.layerMerge, label: LAYER_LABEL.merge, group: COMMAND_GROUP.layers, chord: 'Mod+E', run: mergeLayerDown }),
  pixelCommand({ id: COMMAND_ID.layerFlatten, label: LAYER_LABEL.flatten, group: COMMAND_GROUP.layers, run: flattenLayers }),
  { id: COMMAND_ID.layerDelete, label: LAYER_LABEL.remove, group: COMMAND_GROUP.layers, run: mapOr(deleteMapLayer, deleteLayer) },
  {
    id: COMMAND_ID.layerAbove,
    label: 'Select layer above',
    group: COMMAND_GROUP.layers,
    chord: 'Mod+Up',
    run: mapOr(() => stepMapLayer(1), () => stepLayer(1)),
  },
  {
    id: COMMAND_ID.layerBelow,
    label: 'Select layer below',
    group: COMMAND_GROUP.layers,
    chord: 'Mod+Down',
    run: mapOr(() => stepMapLayer(-1), () => stepLayer(-1)),
  },
];

const EDIT_COMMANDS: readonly CommandDef[] = [...HISTORY_COMMANDS, ...LAYER_COMMANDS].map(editorCommand);

export { EDIT_COMMANDS };
