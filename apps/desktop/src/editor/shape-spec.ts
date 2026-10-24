/* @layer renderer-app @kind logic */
import type { Point, Size } from '@bxel/raster';
import type { ToolSettings } from '../stores/tool-store.type';
import { brushOf } from './brush-of';
import type { ShapeSpec } from './editor.type';
import { symmetryOf } from './symmetry-of';

const shapeSpec = (settings: ToolSettings, size: Size, index: number, at: Point): ShapeSpec => ({
  shape: settings.shape,
  filled: settings.filled,
  index,
  brush: brushOf(settings),
  symmetry: symmetryOf(settings, size),
  from: at,
  to: at,
});

export { shapeSpec };
