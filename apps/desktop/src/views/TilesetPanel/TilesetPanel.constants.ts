/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import type { FieldValue, TileFieldKind, TileTurns } from '@bxel/document';
import { TILEMAP_COMMAND } from '../../keymap/tilemap-command-id.constants';
import type { ThumbZoom, TileFilter, TilesetMode } from '../../stores/tileset-view-store.type';
import type { HintSpec } from '../ActionHint';
import type { StampTransform } from '../../tilemap/tilemap.type';
import type { ZoomChoice } from './TilesetPanel.type';

const TILESET_TEXT = {
  region: 'Tileset',
  empty: 'Open a tileset or a tilemap to see its tiles.',
  noTileset: 'This file has no tileset yet.',
  noTiles: 'This tileset has no tiles yet. Add one, then draw it with Edit tile.',
  noMatch: 'No tiles match.',
  mixed: 'Mixed',
  gridPane: 'Tile grid',
  inspector: 'Tile inspector',
  shapeCanvas: 'Collision shape editor',
  shapeActions: 'Collision shape actions',
  boxField: 'Box',
  points: 'Points',
  pointsHint: 'x,y pairs, three or more',
  removePoint: 'Remove last point',
  nothingToTrace: 'This tile has no opaque pixels to trace.',
  pickShape: (position: number, kind: string): string => `Select shape ${position}, ${kind}`,
  shapeLayer: (position: number): string => `Layer of shape ${position}`,
  oneWay: (position: number): string => `Shape ${position} is one way`,
  oneWayShort: 'One way',
  deleteShape: (position: number): string => `Delete shape ${position}`,
  collisionTitle: 'Collision',
  layer: 'Active layer',
  newLayer: 'New layer',
  newLayerHint: 'water, hurt, one way',
  addLayer: 'Add layer',
  paintTool: 'Collision tool',
  noShapes: 'No collision on this tile. Drag a box on it, add a shape above, or paint Full over tiles in the grid.',
  noShapesAny: 'No tile has collision yet. Pick a tool and drag across tiles, or draw a box on one tile.',
  bulkTitle: (count: number): string => `${count} tiles selected`,
  bulkFull: (count: number): string => `Set Full on ${count} tiles`,
  bulkClear: (count: number): string => `Clear on ${count} tiles`,
  bulkPaste: (count: number): string => `Paste shapes on ${count} tiles`,
  legendOneWay: 'Dashed outline: one way',
  paint: (name: string): string => `Paint ${name} over tiles`,
  stopPaint: (name: string): string => `Stop painting ${name}`,
  clearValue: (name: string): string => `Clear ${name}`,
  removeField: (name: string): string => `Remove field ${name}`,
  painting: 'Drag across tiles to paint this value. Edit the value above to change what is painted.',
  addField: 'Add field',
  fieldName: 'Field name',
  fieldHint: 'surface, hardness',
  fieldKind: 'Field type',
  choices: 'Choices',
  choicesHint: 'Separate the choices with commas.',
  dataTitle: 'Tile data',
  noFields: 'No custom fields yet. Add one such as surface (choice list: stone, water) or hardness (whole number), then paint it over tiles.',
  dataNoPick: 'Pick tiles to edit their values, or use the brush to paint a value.',
  dataPaintHint: 'Edit a value for every selected tile, or use the brush to paint it over many tiles.',
  properties: 'Tile properties',
  name: 'Name',
  type: 'Type',
  typeHint: 'wall, water, door',
  probability: 'Probability',
  turns: 'Allowed turns',
  brush: 'Brush',
  brushActions: 'Flip and turn the brush',
  stampPreview: 'Brush preview',
  noBrush: 'No tile picked. Pick tiles to paint with.',
  brushTile: (key: number): string => `Tile ${key}`,
  emptySlot: (position: number): string => `Empty layout slot ${position}`,
  noLastShape: 'Draw a box or a shape in the inspector first, then paint it.',
  clearFilter: 'Clear filter',
  grid: 'Tiles',
  actions: 'Tile actions',
  newTileset: 'New tileset...',
  newTilemap: 'New tilemap...',
  newTilemapFromSet: 'New tilemap from this tileset',
  mode: 'Tileset mode',
  search: 'Search tiles',
  searchId: 'tileset-search',
  searchHint: 'Search key, name, type or value',
  zoom: 'Thumbnail size',
  filters: 'Filter tiles',
  columns: 'Columns',
  columnsId: 'tileset-columns',
  keys: 'Show keys',
  uses: 'Show use counts',
  editing: 'Editing',
  summary: (name: string, width: number, height: number, count: number): string =>
    `${name}: ${count} ${count === 1 ? 'tile' : 'tiles'} of ${width} x ${height} px`,
  noPick: 'Pick a tile to see its properties.',
  pickedOne: (key: number, uses: number): string => `Tile ${key}, placed ${uses} ${uses === 1 ? 'time' : 'times'}`,
  pickedMany: (count: number): string => `${count} tiles selected`,
  stampLine: (columns: number, rows: number): string => `${columns} x ${rows} stamp`,
  scatterLine: (count: number): string => `Scatter of ${count} tiles`,
} as const;

const MODES: readonly { value: TilesetMode; label: string; icon: IconName; description: string }[] = [
  { value: 'tiles', label: 'Tiles', icon: 'pixel-tileset', description: 'Pick tiles, set their name, type and probability.' },
  { value: 'terrain', label: 'Terrain', icon: 'waves', description: 'See which tiles take part in the terrain rules.' },
  { value: 'collision', label: 'Collision', icon: 'square', description: 'Draw collision shapes on named layers, or paint one over many tiles.' },
  { value: 'data', label: 'Data', icon: 'tag', description: 'Give tiles typed custom data, or paint a value over many tiles.' },
  { value: 'animation', label: 'Animation', icon: 'pixel-animation', description: 'Link tiles to animations, or build one from the selected tiles.' },
];

const MODE_OPTIONS = MODES.map((mode) => ({
  value: mode.value,
  icon: mode.icon,
  title: `${mode.label} (${MODES.indexOf(mode) + 1})`,
  hint: { label: mode.label, description: mode.description },
}));

const FILTERS: readonly { value: TileFilter; label: string }[] = [
  { value: 'used', label: 'Used' },
  { value: 'unused', label: 'Unused' },
  { value: 'animated', label: 'Animated' },
  { value: 'collision', label: 'Collision' },
  { value: 'terrain', label: 'Terrain' },
];

const ZOOMS: readonly ZoomChoice[] = [
  { zoom: 'fit', label: 'Fit' },
  { zoom: 1, label: '1x' },
  { zoom: 2, label: '2x' },
  { zoom: 3, label: '3x' },
  { zoom: 4, label: '4x' },
];

const ZOOM_MAX = 4;

const GRID_PADDING = 12;

const CELL_FRAME = 8;

const MIXED_VALUE = '__mixed__';

const COLOUR_PATTERN = /^#[0-9a-fA-F]{6}$/;


const STAMP_BOX = { size: 64, maxScale: 4 } as const;

const PAGE_ROWS = 4;

const SPLIT_RATIO = { start: 0.5, min: 0.25, max: 0.8 } as const;

const TURN_CHOICES: readonly { value: TileTurns; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'flips', label: 'Flips' },
  { value: 'all', label: 'Flips and turns' },
];

const FIELD_KINDS: readonly { value: TileFieldKind; label: string }[] = [
  { value: 'bool', label: 'On or off' },
  { value: 'int', label: 'Whole number' },
  { value: 'number', label: 'Number' },
  { value: 'text', label: 'Text' },
  { value: 'choice', label: 'Choice list' },
  { value: 'colour', label: 'Colour' },
];

const FIELD_DEFAULTS: Readonly<Record<TileFieldKind, FieldValue>> = {
  bool: false,
  int: 0,
  number: 0,
  text: '',
  choice: '',
  colour: '#3366cc',
};

const CHIP_COLOURS: readonly string[] = ['--c-primary-bright', '--c-success', '--c-warning', '--c-danger', '--c-info'];

const LAYER_COLOURS: readonly string[] = ['--c-danger', '--c-info', '--c-warning', '--c-success', '--c-primary-bright'];

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

const SHAPE_KIND_TEXT = { full: 'Full', rect: 'Box', polygon: 'Shape' } as const;

const SHAPE_ACTIONS: readonly { id: 'box' | 'full' | 'shape' | 'trace' | 'copy' | 'paste'; icon: IconName; hint: HintSpec }[] = [
  { id: 'box', icon: 'pixel-shape-rect', hint: { name: 'Add box', description: 'Add a box on the active layer. You can also drag a box on the tile.' } },
  { id: 'full', icon: 'pixel-shape-rect-filled', hint: { name: 'Add full', description: 'Add a shape that covers the whole tile.' } },
  { id: 'shape', icon: 'pixel-shape-polygon', hint: { name: 'Add shape', description: 'Add a triangle. Drag its points, double click to add or remove a point.' } },
  { id: 'trace', icon: 'wand-sparkles', hint: { name: 'Trace pixels', description: 'Add a shape that hugs the opaque pixels of the tile.' } },
  { id: 'copy', icon: 'copy', hint: { name: 'Copy shapes', description: 'Keep this tile shapes to paste onto other tiles.' } },
  { id: 'paste', icon: 'pixel-layers', hint: { name: 'Paste shapes', description: 'Replace the shapes of the picked tiles with the copied ones.' } },
];

const PAINT_CHOICES = [
  { value: 'select', label: 'Select' },
  { value: 'full', label: 'Paint full' },
  { value: 'last', label: 'Paint last shape' },
] as const;

const ZOOM_DEFAULT: ThumbZoom = 'fit';

export {
  ADD_HINT,
  BRUSH_ACTIONS,
  PAINT_CHOICES,
  SHAPE_ACTIONS,
  SHAPE_KIND_TEXT,
  CELL_FRAME,
  CHIP_COLOURS,
  COLOUR_PATTERN,
  DELETE_HINT,
  DUPLICATE_HINT,
  EDIT_HINT,
  FIELD_DEFAULTS,
  FIELD_KINDS,
  FILTERS,
  GRID_PADDING,
  LAYER_COLOURS,
  MIXED_VALUE,
  MODE_OPTIONS,
  MODES,
  NEW_TILEMAP_HINT,
  NEW_TILESET_HINT,
  PAGE_ROWS,
  SPLIT_RATIO,
  STAMP_BOX,
  TILE_MENU,
  TILESET_TEXT,
  TURN_CHOICES,
  UNIQUE_HINT,
  ZOOM_DEFAULT,
  ZOOM_MAX,
  ZOOMS,
};
