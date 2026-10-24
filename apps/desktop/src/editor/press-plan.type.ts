/* @layer renderer-app @kind types */
import type { StrokeTool } from './tool.type';

type ColourSlot = 'foreground' | 'background';

interface PressEvent {
  button: number;
  altKey: boolean;
  shiftKey: boolean;
}

type PressPlan =
  | { kind: 'pick'; slot: ColourSlot }
  | { kind: 'fill'; slot: ColourSlot }
  | { kind: 'zoom'; out: boolean }
  | { kind: 'shape'; slot: ColourSlot }
  | { kind: 'stroke'; tool: StrokeTool; slot: ColourSlot; line: boolean };

type DrawPlan = Extract<PressPlan, { kind: 'shape' | 'stroke' }>;

export type { ColourSlot, DrawPlan, PressEvent, PressPlan };
