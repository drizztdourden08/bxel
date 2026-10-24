/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { paletteAssign } from './palette-assign';
import { paletteCreate } from './palette-create';
import { paletteDelete } from './palette-delete';
import { paletteDetach } from './palette-detach';
import { paletteDuplicate } from './palette-duplicate';
import { paletteImport } from './palette-import';
import { paletteReorder } from './palette-reorder';
import { paletteResize } from './palette-resize';
import { paletteUpdate } from './palette-update';
import { rampAdd } from './ramp-add';
import { rampDelete } from './ramp-delete';
import { rampUpdate } from './ramp-update';
import { spriteImport } from './sprite-import';
import { swatchAdd } from './swatch-add';
import { swatchDelete } from './swatch-delete';
import { swatchMerge } from './swatch-merge';
import { swatchUpdate } from './swatch-update';

const paletteCommands: readonly CommandDef[] = [
  swatchAdd,
  swatchUpdate,
  swatchDelete,
  swatchMerge,
  paletteReorder,
  paletteResize,
  paletteCreate,
  paletteUpdate,
  paletteDelete,
  paletteDetach,
  paletteDuplicate,
  paletteAssign,
  paletteImport,
  rampAdd,
  rampUpdate,
  rampDelete,
  spriteImport,
];

export { paletteCommands };
