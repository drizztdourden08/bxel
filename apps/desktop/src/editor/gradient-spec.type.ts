/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import type { EditorTarget } from './editor.type';
import type { ColourSlot } from './press-plan.type';

type GradientInput = {
  readonly tools: ToolSettings;
  readonly drawing: DrawingSettings;
  readonly target: EditorTarget;
  readonly slot: ColourSlot;
  readonly at: Point;
};

export type { GradientInput };
