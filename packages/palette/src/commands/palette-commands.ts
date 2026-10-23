/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { paletteCreate } from './palette-create';
import { paletteReorder } from './palette-reorder';
import { paletteResize } from './palette-resize';
import { spriteImport } from './sprite-import';
import { swatchAdd } from './swatch-add';
import { swatchUpdate } from './swatch-update';

const paletteCommands: readonly CommandDef[] = [
  swatchAdd,
  swatchUpdate,
  paletteReorder,
  paletteResize,
  paletteCreate,
  spriteImport,
];

export { paletteCommands };
