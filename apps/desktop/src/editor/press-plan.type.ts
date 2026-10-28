/* @layer renderer-app @kind types */
import type { PathTool, ShapeTool, StrokeTool } from './tool.type';

type ColourSlot = 'foreground' | 'background' | 'third' | 'fourth';

interface PressEvent {
  button: number;
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}

type PressPlan =
  | { kind: 'pick'; slot: ColourSlot }
  | { kind: 'fill'; slot: ColourSlot }
  | { kind: 'zoom'; out: boolean }
  | { kind: 'shape'; shape: ShapeTool; slot: ColourSlot }
  | { kind: 'path'; tool: PathTool; slot: ColourSlot }
  | { kind: 'gradient'; slot: ColourSlot }
  | { kind: 'spray'; slot: ColourSlot }
  | { kind: 'stroke'; tool: StrokeTool; slot: ColourSlot; line: boolean; snap?: boolean; shade?: boolean };

type DrawPlan = Extract<PressPlan, { kind: 'shape' | 'stroke' | 'path' | 'gradient' | 'spray' }>;

export type { ColourSlot, DrawPlan, PressEvent, PressPlan };
