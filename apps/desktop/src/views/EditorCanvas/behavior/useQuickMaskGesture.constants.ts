/* @layer renderer-app @kind constants */
import type { ShapeKind } from '@bxel/raster';

const MASK_SHAPES: Readonly<Record<string, ShapeKind>> = { line: 'line', rect: 'rect', ellipse: 'ellipse' };

const MASK_TOOLS: readonly string[] = ['pencil', 'eraser', 'fill', ...Object.keys(MASK_SHAPES)];

export { MASK_SHAPES, MASK_TOOLS };
