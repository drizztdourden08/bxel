/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import type { ToolSettings } from '../stores/tool-store.type';
import { brushOf } from './brush-of';
import type { BrushOptions } from './editor.type';
import { symmetryOf } from './symmetry-of';

const brushOptions = (settings: ToolSettings, size: Size): BrushOptions => ({
  brush: brushOf(settings),
  pixelPerfect: settings.pixelPerfect,
  symmetry: symmetryOf(settings, size),
});

export { brushOptions };
