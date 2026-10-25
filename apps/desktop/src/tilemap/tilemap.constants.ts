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
  noMap: 'This file has no tilemap yet. A tilemap places tiles on a grid.',
  noTarget: 'Create a tileset with a tile and a tilemap first.',
  noTile: 'Pick or add a tile first.',
  noTiles: 'This tileset has no tiles yet.',
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
  terrainPaint: 'Paint terrain',
  terrainErase: 'Erase terrain',
  createTileset: 'New tileset',
  createTilemap: 'New tilemap',
  layerAdd: 'Add map layer',
  layerDelete: 'Delete map layer',
  layerRename: 'Rename map layer',
  layerMove: 'Move map layer',
  layerVisible: 'Show or hide map layer',
  layerLocked: 'Lock or unlock map layer',
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
  shape: 'rect',
  zoom: 'zoom',
  hand: 'hand',
  select: 'select',
  move: 'place',
};

const TILE_CANVASES = new WeakMap<FrameImage, HTMLCanvasElement>();

export { MAP_TOOL_OF, TILE_CANVASES, TILE_LABEL, TILE_REF, TILEMAP_TEXT };
