/* @layer renderer-app @kind types */
import type { ToolId } from '../editor/tool.type';

interface ToolSettings {
  tool: ToolId;
  foreground: number;
  background: number;
  brushSize: number;
}

interface ToolState extends ToolSettings {
  setTool: (tool: ToolId) => void;
  setForeground: (index: number) => void;
  setBackground: (index: number) => void;
  swapColors: () => void;
}

export type { ToolSettings, ToolState };
