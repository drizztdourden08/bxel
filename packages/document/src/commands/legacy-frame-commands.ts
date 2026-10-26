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
import { tagAdd } from './tag/tag-add';
import { tagDelete } from './tag/tag-delete';
import { tagUpdate } from './tag/tag-update';

const legacyFrameCommands: readonly CommandDef[] = [
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

export { legacyFrameCommands };
