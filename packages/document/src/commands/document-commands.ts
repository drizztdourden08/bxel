/* @layer core @kind logic */
import type { CommandDef } from './command-def.type';
import { celClear } from './cel/cel-clear';
import { celCopy } from './cel/cel-copy';
import { celLink } from './cel/cel-link';
import { celMove } from './cel/cel-move';
import { celUnlink } from './cel/cel-unlink';
import { frameAdd } from './frame/frame-add';
import { frameDelete } from './frame/frame-delete';
import { frameDuplicate } from './frame/frame-duplicate';
import { frameReorder } from './frame/frame-reorder';
import { frameUpdate } from './frame/frame-update';
import { layerAdd } from './layer/layer-add';
import { layerDelete } from './layer/layer-delete';
import { layerDuplicate } from './layer/layer-duplicate';
import { layerFlatten } from './layer/layer-flatten';
import { layerMerge } from './layer/layer-merge';
import { layerReorder } from './layer/layer-reorder';
import { layerUpdate } from './layer/layer-update';
import { pixelsPatch } from './pixels/pixels-patch';
import { artworkUpdate } from './artwork/artwork-update';
import { spriteCreate } from './sprite/sprite-create';
import { spriteUpdate } from './sprite/sprite-update';
import { tagAdd } from './tag/tag-add';
import { tagDelete } from './tag/tag-delete';
import { tagUpdate } from './tag/tag-update';
import { mapErase } from './map/map-erase';
import { mapFill } from './map/map-fill';
import { mapPaint } from './map/map-paint';
import { mapRect } from './map/map-rect';
import { mapReplace } from './map/map-replace';
import { mapLayerAdd } from './map-layer/map-layer-add';
import { mapLayerDelete } from './map-layer/map-layer-delete';
import { mapLayerReorder } from './map-layer/map-layer-reorder';
import { mapLayerUpdate } from './map-layer/map-layer-update';
import { tileAdd } from './tile/tile-add';
import { tileDelete } from './tile/tile-delete';
import { tileUnique } from './tile/tile-unique';
import { tilemapCreate } from './tilemap/tilemap-create';
import { tilemapDelete } from './tilemap/tilemap-delete';
import { tilemapResize } from './tilemap/tilemap-resize';
import { tilemapUpdate } from './tilemap/tilemap-update';
import { tilesetCreate } from './tileset/tileset-create';
import { tilesetDelete } from './tileset/tileset-delete';
import { tilesetUpdate } from './tileset/tileset-update';

const documentCommands: readonly CommandDef[] = [
  artworkUpdate,
  spriteCreate,
  spriteUpdate,
  pixelsPatch,
  layerAdd,
  layerDelete,
  layerUpdate,
  layerReorder,
  layerDuplicate,
  layerMerge,
  layerFlatten,
  frameAdd,
  frameDelete,
  frameDuplicate,
  frameReorder,
  frameUpdate,
  tagAdd,
  tagUpdate,
  tagDelete,
  celClear,
  celCopy,
  celMove,
  celLink,
  celUnlink,
  tilesetCreate,
  tilesetUpdate,
  tilesetDelete,
  tileAdd,
  tileDelete,
  tileUnique,
  tilemapCreate,
  tilemapUpdate,
  tilemapResize,
  tilemapDelete,
  mapLayerAdd,
  mapLayerUpdate,
  mapLayerDelete,
  mapLayerReorder,
  mapPaint,
  mapErase,
  mapFill,
  mapRect,
  mapReplace,
];

export { documentCommands };
