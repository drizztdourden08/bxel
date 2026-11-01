/* @layer renderer-app @kind types */
import type { Point, Size } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import type { EditorTarget } from './editor.type';
import type { ColourSlot } from './press-plan.type';
import type { PathTool } from './tool.type';

type PathInput = {
  readonly tools: ToolSettings;
  readonly drawing: DrawingSettings;
  readonly target: EditorTarget;
  readonly size: Size;
  readonly tool: PathTool;
  readonly slot: ColourSlot;
  readonly at?: Point;
};

export type { PathInput };
