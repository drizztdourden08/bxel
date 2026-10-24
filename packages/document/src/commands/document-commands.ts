/* @layer core @kind logic */
import type { CommandDef } from './command-def.type';
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
];

export { documentCommands };
