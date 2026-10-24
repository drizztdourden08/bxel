/* @layer renderer-app @kind types */
import type { LayerId } from '@bxel/document';
import type { ToolId } from '../editor/tool.type';

interface ToolSettings {
  tool: ToolId;
  foreground: number;
  background: number;
  brushSize: number;
  layerId: LayerId | null;
}

interface ToolState extends ToolSettings {
  setTool: (tool: ToolId) => void;
  setForeground: (index: number) => void;
  setBackground: (index: number) => void;
  swapColors: () => void;
  setLayer: (layerId: LayerId | null) => void;
}

export type { ToolSettings, ToolState };
