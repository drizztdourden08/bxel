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
];

export { documentCommands };
