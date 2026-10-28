/* @layer renderer-app @kind constants */
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

const ZOOM_MAX = 4;

const GRID_PADDING = 12;

const CELL_FRAME = 8;

const MIXED_VALUE = '__mixed__';

const COLOUR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const STAMP_BOX = { size: 64, maxScale: 4 } as const;

const PAGE_ROWS = 4;

const SPLIT_RATIO = { start: 0.5, min: 0.25, max: 0.8 } as const;

export {
  CELL_FRAME,
  COLOUR_PATTERN,
  GRID_PADDING,
  MIXED_VALUE,
  PAGE_ROWS,
  SPLIT_RATIO,
  STAMP_BOX,
  TILESET_TEXT,
  ZOOM_MAX,
};
export { ADD_HINT, BRUSH_ACTIONS, DELETE_HINT, DUPLICATE_HINT, EDIT_HINT, NEW_TILEMAP_HINT, NEW_TILESET_HINT, SHAPE_ACTIONS, TILE_MENU, UNIQUE_HINT } from './TilesetHints.constants';
export { FILTERS, MODE_OPTIONS, MODES, ZOOMS } from './TilesetModes.constants';
export { CHIP_COLOURS, FIELD_DEFAULTS, FIELD_KINDS, LAYER_COLOURS, PAINT_CHOICES, SHAPE_KIND_TEXT, TURN_CHOICES } from './TilesetFields.constants';
