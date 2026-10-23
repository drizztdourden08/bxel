/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { paletteReorder } from './palette-reorder';
import { paletteResize } from './palette-resize';
import { swatchAdd } from './swatch-add';
import { swatchUpdate } from './swatch-update';

const paletteCommands: readonly CommandDef[] = [swatchAdd, swatchUpdate, paletteReorder, paletteResize];

export { paletteCommands };
