/* @layer renderer-app @kind constants */
import type { ShapeKind } from '@bxel/raster';
import type { QuickMaskMods } from './useQuickMaskGesture.type';

const MASK_SHAPES: Readonly<Record<string, ShapeKind>> = { line: 'line', rect: 'rect', ellipse: 'ellipse' };

const MASK_TOOLS: readonly string[] = ['pencil', 'eraser', 'fill', ...Object.keys(MASK_SHAPES)];

const NO_MODS: QuickMaskMods = { constrain: false, centre: false };

export { MASK_SHAPES, MASK_TOOLS, NO_MODS };
