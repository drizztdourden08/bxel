/* @layer renderer-app @kind types */
import type { StrokeTool } from './tool.type';

type ColourSlot = 'foreground' | 'background';

interface PressEvent {
  button: number;
  altKey: boolean;
}

type PressPlan =
  | { kind: 'pick'; slot: ColourSlot }
  | { kind: 'fill'; slot: ColourSlot }
  | { kind: 'stroke'; tool: StrokeTool; slot: ColourSlot };

export type { ColourSlot, PressEvent, PressPlan };
