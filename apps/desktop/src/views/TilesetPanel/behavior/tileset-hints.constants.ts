/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import type { StampTransform } from '../../../tilemap/tilemap.type';
import type { HintSpec } from '../../ActionHint';

const ADD_HINT: HintSpec = {
  name: 'Add tile',
  description: 'Add an empty tile to the tileset and pick it. Draw it with Edit tile.',
  shortcuts: [{ command: TILEMAP_COMMAND.addTile }],
};

const DUPLICATE_HINT: HintSpec = {
  name: 'Duplicate tile',
  description: 'Add a copy of the picked tile as a new tile. Map cells keep the original.',
  shortcuts: [{ command: TILEMAP_COMMAND.duplicateTile }],
};

const DELETE_HINT: HintSpec = {
  name: 'Delete tile',
  description: 'Remove the picked tile. A tile that is placed asks what happens to its cells.',
  shortcuts: [{ command: TILEMAP_COMMAND.deleteTile }],
};

const EDIT_HINT: HintSpec = {
  name: 'Edit tile pixels',
  description: 'Draw on the picked tile. Every cell that uses the tile changes with it.',
  shortcuts: [{ command: TILEMAP_COMMAND.toggleEdit }],
};

const UNIQUE_HINT: HintSpec = {
  name: 'Make unique',
  description: 'Give the selected map cells their own copy of their tile. Other cells keep the original.',
  shortcuts: [{ command: TILEMAP_COMMAND.makeUnique }],
};

const TILE_MENU = {
  label: 'Tile actions',
  tile: '[data-tile-key]',
  edit: 'Edit tile',
  place: 'Place with this tile',
  remove: 'Delete tile...',
  needCells: 'Select some cells on the map first.',
} as const;

const NEW_TILESET_HINT: HintSpec = {
  name: 'New tileset',
  description: 'Start another set of tiles with its own tile size.',
  shortcuts: [{ command: TILEMAP_COMMAND.newTileset }],
};

const NEW_TILEMAP_HINT: HintSpec = {
  name: 'New tilemap',
  description: 'Start another map built from a tileset.',
  shortcuts: [{ command: TILEMAP_COMMAND.newTilemap }],
};

const BRUSH_ACTIONS: readonly { op: StampTransform; icon: IconName; hint: HintSpec }[] = [
  {
    op: 'flipX',
    icon: 'pixel-flip-tile-x',
    hint: { name: 'Flip brush X', description: 'Mirror the brush left to right. A block of tiles mirrors as a block.', shortcuts: [{ command: 'symmetry.toggle_x' }] },
  },
  {
    op: 'flipY',
    icon: 'pixel-flip-tile-y',
    hint: { name: 'Flip brush Y', description: 'Mirror the brush top to bottom.', shortcuts: [{ command: 'symmetry.toggle_y' }] },
  },
  {
    op: 'turnLeft',
    icon: 'pixel-turn-left',
    hint: { name: 'Rotate brush left', description: 'Turn the brush a quarter turn left. Needs square tiles.', shortcuts: [{ command: 'brush.smaller' }] },
  },
  {
    op: 'turnRight',
    icon: 'pixel-turn-right',
    hint: { name: 'Rotate brush right', description: 'Turn the brush a quarter turn right. Needs square tiles.', shortcuts: [{ command: 'brush.larger' }] },
  },
  { op: 'reset', icon: 'rotate-ccw', hint: { name: 'Reset brush', description: 'Drop every flip and turn.' } },
];

const SHAPE_ACTIONS: readonly { id: 'box' | 'full' | 'shape' | 'trace' | 'copy' | 'paste'; icon: IconName; hint: HintSpec }[] = [
  { id: 'box', icon: 'pixel-shape-rect', hint: { name: 'Add box', description: 'Add a box on the active layer. You can also drag a box on the tile.' } },
  { id: 'full', icon: 'pixel-shape-rect-filled', hint: { name: 'Add full', description: 'Add a shape that covers the whole tile.' } },
  { id: 'shape', icon: 'pixel-shape-polygon', hint: { name: 'Add shape', description: 'Add a triangle. Drag its points, double click to add or remove a point.' } },
  { id: 'trace', icon: 'wand-sparkles', hint: { name: 'Trace pixels', description: 'Add a shape that hugs the opaque pixels of the tile.' } },
  { id: 'copy', icon: 'copy', hint: { name: 'Copy shapes', description: 'Keep this tile shapes to paste onto other tiles.' } },
  { id: 'paste', icon: 'pixel-layers', hint: { name: 'Paste shapes', description: 'Replace the shapes of the picked tiles with the copied ones.' } },
];

export {
  ADD_HINT,
  BRUSH_ACTIONS,
  DELETE_HINT,
  DUPLICATE_HINT,
  EDIT_HINT,
  NEW_TILEMAP_HINT,
  NEW_TILESET_HINT,
  SHAPE_ACTIONS,
  TILE_MENU,
  UNIQUE_HINT,
};
