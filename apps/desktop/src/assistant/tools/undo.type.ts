/* @layer renderer-app @kind types */
import type { UndoInput } from './tool-input.type';

type Direction = 'undo' | 'redo';

type StepInput = UndoInput & { readonly direction?: Direction; readonly steps?: number };

type Done = { revision: number; changes: unknown; label: string; origin: 'ui' | 'mcp'; count: number };

export type { Direction, Done, StepInput };
