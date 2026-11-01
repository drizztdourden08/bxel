/* @layer renderer-app @kind constants */
import type { ToolId } from '../editor/tool.type';
import type { FrameImage } from '../sheet/sheet.type';
import type { MapTool } from './tilemap.type';

const TILEMAP_TEXT = {
  mode: 'Tilemap',
  newTileset: 'New tileset',
  newTilemap: 'New tilemap',
  noFile: 'Open a file first.',
  noTileset: 'This file has no tileset yet. A tileset holds the tiles a map is built from.',
  noTarget: 'Create a tileset with a tile and a tilemap first.',
  noTile: 'Pick or add a tile first.',
  noTiles: 'This tileset has no tiles yet.',
  noScatter: 'Every tile in the scatter set has probability 0, so nothing was placed.',
  needSquare: 'Turning needs square tiles.',
  needSelection: 'Select some cells first.',
  needFirstTile: 'Add a tile to this tileset first.',
  emptyCanvas: 'Open a file to edit tilemaps.',
  canvasLabel: 'Tilemap canvas',
  canvasHint: 'Arrow keys move the cell cursor. Space or Enter applies the current tool to the cell. With the rectangle and select tools, press once for the first corner and again for the last. Escape drops the corner.',
  previewOpen: 'Apply or cancel the preview first.',
} as const;

const TILE_LABEL = {
  place: 'Place tiles',
  erase: 'Erase tiles',
  fill: 'Fill tiles',
  rect: 'Draw tile rectangle',
  replace: 'Replace tiles',
  flip: 'Turn placed tiles',
  clear: 'Clear placed tiles',
  addTile: 'Add tile',
  duplicateTile: 'Duplicate tile',
  makeUnique: 'Make tile unique',
  deleteTile: 'Delete tile',
  collision: 'Set tile collision',
  terrain: 'Set terrain rules',
  tileData: 'Set tile data',
  pasteData: 'Paste tile data',
  copiedCollision: 'Copied the collision of the tile.',
  copiedData: 'Copied the data of the tile.',
  renameTile: 'Rename tile',
  fields: 'Edit tile fields',
  layout: 'Arrange tiles',
  animateTiles: 'Make animation from tiles',
  terrainPaint: 'Paint terrain',
  terrainErase: 'Erase terrain',
  createTileset: 'New tileset',
  createTilemap: 'New tilemap',
  line: 'Map line',
  scatter: 'Random place',
  layerAdd: 'Add map layer',
  layerDelete: 'Delete map layer',
  layerRename: 'Rename map layer',
  layerMove: 'Move map layer',
  layerVisible: 'Show or hide map layer',
  layerLocked: 'Lock or unlock map layer',
  layerDuplicate: 'Duplicate map layer',
  layerMerge: 'Merge map layer down',
  layerColour: 'Set map layer colour',
  layerOpacity: 'Set map layer opacity',
  layerSolo: 'Show only one map layer',
  layerDeleteMany: 'Delete map layers',
  layerGroup: 'Group map layers',
  layerUngroup: 'Ungroup map layers',
  layerFlattenGroup: 'Flatten map group',
  cut: 'Cut cells',
  paste: 'Paste cells',
  move: 'Move cells',
  duplicate: 'Duplicate cells',
} as const;

const STAMP_SLOT_TEXT = {
  empty: (slot: number): string => `Stamp slot ${slot} is empty. Pick a stamp, then press Ctrl+Alt+${slot} to keep it.`,
  stored: (slot: number): string => `Stamp kept in slot ${slot}`,
  recalled: (slot: number): string => `Stamp from slot ${slot}`,
} as const;

const CELL_CLIP_TEXT = {
  noCells: 'Copy some cells first.',
  otherTileset: 'The copied cells use another tileset, so their tiles do not match this map.',
  copied: 'Copied the cells.',
  noStamp: 'The selected cells are empty, so there is no stamp to take.',
  tooMany: 'The selection has too many separate runs to move in one step.',
} as const;

const TILE_REF = {
  tileset: 'tileset',
  tilemap: 'tilemap',
  tile: 'tile',
  layer: 'maplayer',
} as const;

const MAP_TOOL_OF: Readonly<Record<ToolId, MapTool>> = {
  pencil: 'place',
  eraser: 'erase',
  fill: 'fill',
  picker: 'pick',
  rect: 'rect',
  line: 'line',
  spray: 'scatter',
  gradient: 'place',
  shade: 'place',
  curve: 'place',
  ellipse: 'rect',
  contour: 'place',
  polygon: 'place',
  zoom: 'zoom',
  hand: 'hand',
  select: 'select',
  move: 'place',
  slice: 'hand',
};

const TILE_CANVASES = new WeakMap<FrameImage, HTMLCanvasElement>();

export { CELL_CLIP_TEXT, MAP_TOOL_OF, STAMP_SLOT_TEXT, TILE_CANVASES, TILE_LABEL, TILE_REF, TILEMAP_TEXT };
