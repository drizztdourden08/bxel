/* @layer renderer-app @kind types */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { ToolId } from '../tool.type';
import type { ToolPreset } from '../presets/tool-preset.type';
import type { Surface } from '../tool-catalogue/surface.type';

interface QuickPoint {
  x: number;
  y: number;
}

type QuickKind = 'tool' | 'recent' | 'preset';

interface QuickChoice {
  kind: QuickKind;
  id: string;
}

interface QuickInput {
  surface: Surface;
  recent: readonly string[];
  presets: readonly ToolPreset[];
  keysOf: (tool: ToolId) => ShortcutKey[] | undefined;
}

export type { QuickChoice, QuickInput, QuickKind, QuickPoint };
