/* @layer core @kind logic */
import type { CommandDef } from './command-def.type';
import { mapCommands } from './map-commands';
import { layerAdd } from './layer/layer-add';
import { layerDelete } from './layer/layer-delete';
import { layerDuplicate } from './layer/layer-duplicate';
import { layerFlatten } from './layer/layer-flatten';
import { layerMerge } from './layer/layer-merge';
import { layerReorder } from './layer/layer-reorder';
import { layerUpdate } from './layer/layer-update';
import { layerGroup } from './layer/layer-group';
import { layerUngroup } from './layer/layer-ungroup';
import { layerReferenceAdd } from './layer/layer-reference-add';
import { layerReferenceRelink } from './layer/layer-reference-relink';
import { pixelsPatch } from './pixels/pixels-patch';
import { artworkUpdate } from './artwork/artwork-update';
import { brushAdd } from './brush/brush-add';
import { brushDelete } from './brush/brush-delete';
import { brushUpdate } from './brush/brush-update';
import { presetAdd } from './preset/preset-add';
import { presetDelete } from './preset/preset-delete';
import { presetRename } from './preset/preset-rename';
import { presetUpdate } from './preset/preset-update';
import { sheetAdd } from './sheet/sheet-add';
import { sheetAnimationAdd } from './sheet/sheet-animation-add';
import { sheetAnimationMove } from './sheet/sheet-animation-move';
import { sheetAnimationPlace } from './sheet/sheet-animation-place';
import { sheetAnimationRemove } from './sheet/sheet-animation-remove';
import { sheetArrange } from './sheet/sheet-arrange';
import { sheetCreate } from './sheet/sheet-create';
import { sheetDelete } from './sheet/sheet-delete';
import { sheetPlace } from './sheet/sheet-place';
import { sheetRemove } from './sheet/sheet-remove';
import { sheetGuides } from './sheet/sheet-guides';
import { sheetUpdate } from './sheet/sheet-update';
import { guideAdd } from './guide/guide-add';
import { guideClear } from './guide/guide-clear';
import { spriteSymmetry } from './sprite/sprite-symmetry';
import { guideMove } from './guide/guide-move';
import { guideRemove } from './guide/guide-remove';
import { sliceAdd } from './slice/slice-add';
import { sliceDelete } from './slice/slice-delete';
import { sliceUpdate } from './slice/slice-update';
import { spriteCreate } from './sprite/sprite-create';
import { spriteDelete } from './sprite/sprite-delete';
import { spriteDuplicate } from './sprite/sprite-duplicate';
import { spriteReorder } from './sprite/sprite-reorder';
import { spriteUpdate } from './sprite/sprite-update';
import { animationCreate } from './animation/animation-create';
import { animationUpdate } from './animation/animation-update';
import { animationDelete } from './animation/animation-delete';
import { animationDuplicate } from './animation/animation-duplicate';
import { animationFrameAdd } from './animation/animation-frame-add';
import { animationFrameUpdate } from './animation/animation-frame-update';
import { animationFrameDelete } from './animation/animation-frame-delete';
import { animationFrameReorder } from './animation/animation-frame-reorder';
import { animationFrameReverse } from './animation/animation-frame-reverse';
import { animationFrameOwn } from './animation/animation-frame-own';
import { animationFrameRelease } from './animation/animation-frame-release';
import { animationTagAdd } from './animation/animation-tag-add';
import { animationTagUpdate } from './animation/animation-tag-update';
import { animationTagDelete } from './animation/animation-tag-delete';
import { animationDirections } from './animation/animation-directions';
import { animationFacingDraw } from './animation/animation-facing-draw';
import { animationSplit } from './animation/animation-split';
import { tileAnimation } from './tile/tile-animation';
import { tileAdd } from './tile/tile-add';
import { tileCollision } from './tile/tile-collision';
import { tileData } from './tile/tile-data';
import { tileShapes } from './tile/tile-shapes';
import { tilesetFields } from './tileset/tileset-fields';
import { tilesetLayout } from './tileset/tileset-layout';
import { tileDelete } from './tile/tile-delete';
import { tileUnique } from './tile/tile-unique';
import { tilemapCreate } from './tilemap/tilemap-create';
import { tilemapDelete } from './tilemap/tilemap-delete';
import { tilemapDuplicate } from './tilemap/tilemap-duplicate';
import { tilemapImport } from './tilemap/tilemap-import';
import { tilemapGuides } from './tilemap/tilemap-guides';
import { tilemapOrient } from './tilemap/tilemap-orient';
import { tilemapResize } from './tilemap/tilemap-resize';
import { tilemapUpdate } from './tilemap/tilemap-update';
import { tilesetCreate } from './tileset/tileset-create';
import { tilesetDelete } from './tileset/tileset-delete';
import { tilesetDuplicate } from './tileset/tileset-duplicate';
import { tilesetTerrain } from './tileset/tileset-terrain';
import { tilesetTerrainSets } from './tileset/tileset-terrain-sets';
import { tilesetUpdate } from './tileset/tileset-update';

const documentCommands: readonly CommandDef[] = [
  artworkUpdate,
  spriteCreate,
  spriteUpdate,
  spriteDelete,
  spriteDuplicate,
  spriteReorder,
  sheetCreate,
  sheetUpdate,
  sheetGuides,
  sheetDelete,
  sheetAdd,
  sheetRemove,
  sheetPlace,
  sheetArrange,
  sheetAnimationAdd,
  sheetAnimationRemove,
  sheetAnimationMove,
  sheetAnimationPlace,
  presetAdd,
  presetUpdate,
  presetRename,
  presetDelete,
  sliceAdd,
  sliceUpdate,
  sliceDelete,
  guideAdd,
  guideMove,
  guideRemove,
  guideClear,
  spriteSymmetry,
  pixelsPatch,
  layerAdd,
  layerDelete,
  layerUpdate,
  layerReorder,
  layerDuplicate,
  layerMerge,
  layerFlatten,
  layerGroup,
  layerUngroup,
  layerReferenceAdd,
  layerReferenceRelink,
  tilesetCreate,
  tilesetUpdate,
  tilesetDelete,
  tilesetDuplicate,
  tileAdd,
  tileDelete,
  tileUnique,
  tileCollision,
  tileShapes,
  tileData,
  tilesetFields,
  tilesetLayout,
  animationCreate,
  animationUpdate,
  animationDelete,
  animationDuplicate,
  animationFrameAdd,
  animationFrameUpdate,
  animationFrameDelete,
  animationFrameReorder,
  animationFrameReverse,
  animationFrameOwn,
  animationFrameRelease,
  animationTagAdd,
  animationTagUpdate,
  animationTagDelete,
  animationDirections,
  animationSplit,
  animationFacingDraw,
  tileAnimation,
  tilesetTerrain,
  tilesetTerrainSets,
  tilemapCreate,
  tilemapUpdate,
  tilemapResize,
  tilemapDelete,
  tilemapDuplicate,
  tilemapImport,
  tilemapOrient,
  tilemapGuides,
  ...mapCommands,
  brushAdd,
  brushUpdate,
  brushDelete,
];

export { documentCommands };
